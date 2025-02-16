import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:easy_sms_receiver/easy_sms_receiver.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'Constants.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SMS Monitor',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const SMSListenerApp(),
    );
  }
}

class SMSListenerApp extends StatefulWidget {
  const SMSListenerApp({super.key});

  @override
  State<SMSListenerApp> createState() => _SMSListenerAppState();
}

class _SMSListenerAppState extends State<SMSListenerApp> {
  final EasySmsReceiver easySmsReceiver = EasySmsReceiver.instance;
  String _easySmsReceiverStatus = "Undefined";
  String _message = "";
  String _userEmail = "";
  String _userId = "";
  String _authToken = "";
  bool _isLoggedIn = false;
  bool _isEmailSent = false;
  Position? _currentPosition;
  String _locationStatus = "Not fetched";

  final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 2,
      errorMethodCount: 8,
      lineLength: 120,
      colors: true,
      printEmojis: true,
      printTime: true,
    ),
  );

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _checkPreviousLogin();
    _requestLocationPermission();
    startSmsReceiver();
  }

  Future<void> _requestLocationPermission() async {
    try {
      _logger.i('Requesting location permissions');

      // Request multiple permissions
      final statuses = await [
        Permission.location,
        Permission.locationWhenInUse,
        Permission.locationAlways
      ].request();

      // Detailed permission handling
      bool allGranted = statuses.values.every((status) => status.isGranted);

      if (allGranted) {
        _logger.i('All location permissions granted');
        _showSnackBar('Location permissions granted successfully');
        await _getCurrentLocation();
      } else {
        _logger.w('Location permissions partially denied');
        _showLocationPermissionDialog();
      }
    } catch (e) {
      _logger.e('Permission request error', error: e);
      _showSnackBar('Error requesting location permissions');
    }
  }

  Future<void> _showLocationPermissionDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Location Permissions Required'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                const Text('This app requires location permissions to:'),
                const SizedBox(height: 10),
                const Text('• Track SMS location context'),
                const Text('• Provide accurate geolocation data'),
                const Text('• Enhance security features'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Open App Settings'),
              onPressed: () {
                openAppSettings();
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Request Permissions'),
              onPressed: () {
                Navigator.of(context).pop();
                _requestLocationPermission();
              },
            ),
          ],
        );
      },
    );
  }

  Future<Position?> _getCurrentLocation() async {
    try {
      _logger.i('Starting location retrieval process');

      // Comprehensive permission check
      var locationPermission = await Geolocator.checkPermission();
      if (locationPermission == LocationPermission.denied) {
        _logger.w('Location permission denied, requesting permission');
        locationPermission = await Geolocator.requestPermission();

        if (locationPermission == LocationPermission.denied) {
          _logger.e('Location permission still denied');
          _showLocationPermissionDialog();
          setState(() => _locationStatus = "Location permission denied");
          return null;
        }
      }

      if (locationPermission == LocationPermission.deniedForever) {
        _logger.e('Location permissions permanently denied');
        _showLocationPermissionDialog();
        setState(
            () => _locationStatus = "Location permissions permanently denied");
        return null;
      }

      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        _logger.w('Location services are disabled');
        await _showLocationServicesDialog();
        setState(() => _locationStatus = "Location services are disabled");
        return null;
      }

      // Fetch location with detailed logging and timeout
      try {
        _logger.i('Attempting to get current position');
        Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high,
          timeLimit: const Duration(seconds: 15),
        );

        _logger.i('Location successfully retrieved: '
            'Lat: ${position.latitude}, Lon: ${position.longitude}, '
            'Accuracy: ${position.accuracy}');

        setState(() {
          _locationStatus = "Location successfully fetched";
          _currentPosition = position;
        });

        return position;
      } catch (e) {
        _logger.e('Location retrieval error', error: e);
        setState(() => _locationStatus = "Error getting location: $e");
        _showLocationRetrievalErrorDialog(e);
        return null;
      }
    } catch (e) {
      _logger.e('Unexpected location error', error: e);
      setState(() => _locationStatus = "Unexpected location error: $e");
      return null;
    }
  }

  Future<void> _showLocationServicesDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Location Services Disabled'),
          content: const SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('Location services are currently disabled. '
                    'Would you like to enable them?'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Open Location Settings'),
              onPressed: () {
                Geolocator.openLocationSettings();
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  void _showLocationRetrievalErrorDialog(dynamic error) {
    showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Location Retrieval Failed'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                const Text('Unable to retrieve your current location.'),
                const SizedBox(height: 10),
                Text('Error Details: ${error.toString()}'),
                const SizedBox(height: 10),
                const Text('Possible reasons:'),
                const Text('• GPS is turned off'),
                const Text('• No internet connection'),
                const Text('• Device location services are restricted'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Retry'),
              onPressed: () {
                Navigator.of(context).pop();
                _getCurrentLocation();
              },
            ),
            TextButton(
              child: const Text('Open Settings'),
              onPressed: () {
                Geolocator.openLocationSettings();
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _checkPreviousLogin() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userEmail = prefs.getString('userEmail') ?? "";
      _userId = prefs.getString('userId') ?? "";
      _authToken = prefs.getString('authToken') ?? "";
      _isLoggedIn = _authToken.isNotEmpty;
    });
  }

  Future<void> _sendOtp() async {
    try {
      final response = await http.post(
        Uri.parse('${Constants.backendUrl}/auth/send-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': _emailController.text.trim()}),
      );

      if (response.statusCode == 200) {
        setState(() => _isEmailSent = true);
        _showSnackBar('OTP sent to your email');
      } else {
        _showSnackBar('Failed to send OTP');
      }
    } catch (error) {
      print('OTP send error: $error');
      _showSnackBar('Error sending OTP');
    }
  }

  Future<void> _verifyOtp() async {
    try {
      final response = await http.post(
        Uri.parse('${Constants.backendUrl}/auth/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': _emailController.text.trim(),
          'otp': _otpController.text.trim(),
        }),
      );

      final responseBody = json.decode(response.body);

      if (response.statusCode == 200) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userEmail', _emailController.text.trim());
        await prefs.setString('userId', responseBody['userId']);
        await prefs.setString('authToken', responseBody['token']);

        setState(() {
          _isLoggedIn = true;
          _userEmail = _emailController.text.trim();
          _userId = responseBody['userId'];
          _authToken = responseBody['token'];
          _isEmailSent = false;
        });

        _showSnackBar('Successfully verified');
      } else {
        _showSnackBar(responseBody['error'] ?? 'Invalid OTP');
      }
    } catch (error) {
      print('OTP verify error: $error');
      _showSnackBar('Error verifying OTP');
    }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('userEmail');
    await prefs.remove('userId');
    await prefs.remove('authToken');

    setState(() {
      _isLoggedIn = false;
      _userEmail = "";
      _userId = "";
      _authToken = "";
      _emailController.clear();
      _otpController.clear();
    });
  }

  Future<void> _sendSmsToBackend(String? message, String? address) async {
    if (message == null || !_isLoggedIn) return;

    try {
      final position = await _getCurrentLocation();

      final response = await http
          .post(
            Uri.parse('${Constants.backendUrl}/api/sms'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $_authToken'
            },
            body: jsonEncode({
              'userId': _userId,
              'message': message,
              'sender': address,
              'timestamp': DateTime.now().toIso8601String(),
              'location': position != null
                  ? {
                      'latitude': position.latitude,
                      'longitude': position.longitude,
                      'accuracy': position.accuracy,
                    }
                  : null,
            }),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        print('SMS with location sent successfully');
      } else {
        print('Failed to send SMS: ${response.statusCode}');
      }
    } catch (e) {
      print('Error sending SMS: $e');
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  Future<void> startSmsReceiver() async {
    final smsStatus = await Permission.sms.status;
    final locationStatus = await Permission.location.status;

    if (smsStatus.isGranted && locationStatus.isGranted) {
      easySmsReceiver.listenIncomingSms(
        onNewMessage: (message) {
          if (!mounted) return;

          setState(() => _message = message.body ?? "Error reading message");
          _sendSmsToBackend(message.body, message.address);
        },
      );

      setState(() => _easySmsReceiverStatus = "Running");
    } else {
      final result = await [
        Permission.sms,
        Permission.location,
      ].request();

      if (result[Permission.sms]!.isGranted &&
          result[Permission.location]!.isGranted) {
        startSmsReceiver();
      } else {
        _showSnackBar('Permissions required');
      }
    }
  }

  void stopSmsReceiver() {
    easySmsReceiver.stopListenIncomingSms();
    setState(() => _easySmsReceiverStatus = "Stopped");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SMS Monitor'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!_isLoggedIn) ...[
              TextField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Enter your email',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 10),
              ElevatedButton(
                onPressed: _sendOtp,
                child: const Text('Send OTP'),
              ),
              if (_isEmailSent) ...[
                TextField(
                  controller: _otpController,
                  decoration: const InputDecoration(
                    labelText: 'Enter OTP',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: _verifyOtp,
                  child: const Text('Verify OTP'),
                ),
              ],
            ] else ...[
              ListTile(
                title: Text('Signed in as: $_userEmail'),
                trailing: IconButton(
                  icon: const Icon(Icons.logout),
                  onPressed: _logout,
                ),
              ),
            ],
            Text('SMS Status: $_easySmsReceiverStatus',
                style: Theme.of(context).textTheme.titleMedium),
            Text('Location Status: $_locationStatus',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 10),
            Text('Latest SMS: $_message',
                style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton.icon(
                  onPressed: startSmsReceiver,
                  icon: const Icon(Icons.play_arrow),
                  label: const Text("Start Monitoring"),
                ),
                ElevatedButton.icon(
                  onPressed: stopSmsReceiver,
                  icon: const Icon(Icons.stop),
                  label: const Text("Stop Monitoring"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
