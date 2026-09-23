import 'package:flutter_test/flutter_test.dart';
import 'package:civilian_mobile/main.dart';

void main() {
  testWidgets('Civilian App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const AegisxCivilianApp());
    expect(find.byType(AegisxCivilianApp), findsOneWidget);
  });
}

