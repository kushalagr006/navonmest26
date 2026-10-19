import { runAuthVerificationTests } from './AuthService.test';
import { runPhase3DataTests } from './Phase3Data.test';
import { runPhase4EngineTests } from './Phase4Engine.test';

export async function runAllVerificationSuites() {
  console.log('=== NEX GUARD VERIFICATION SUITES ===');
  const r1 = await runAuthVerificationTests();
  console.log('Auth Suite:', r1);

  const r2 = await runPhase3DataTests();
  console.log('Phase3 Data Suite:', r2);

  const r3 = await runPhase4EngineTests();
  console.log('Phase4 Engine Suite:', r3);

  const totalPassed = r1.passed + r2.passed + r3.passed;
  const totalFailed = r1.failed + r2.failed + r3.failed;

  console.log(`TOTAL PASSED: ${totalPassed} | TOTAL FAILED: ${totalFailed}`);
  return { totalPassed, totalFailed };
}
