import assert from "node:assert/strict";
import test from "node:test";
import { getAvailableWalletBalance, getWalletPaymentError } from "./walletPayment.js";

test("a zero wallet uses the existing insufficient funds message", () => {
  const balance = getAvailableWalletBalance({ data: { walletBalance: { available: 0 } } });
  assert.equal(balance, 0);
  const error = getWalletPaymentError(balance, 420000);
  assert.equal(error, "Insufficient wallet balance. Please fund your wallet.");
  assert.doesNotMatch(error, /provider/i);
});

test("a partial balance cannot pay while an exact balance can", () => {
  assert.equal(getWalletPaymentError(20000, 30000), "Insufficient wallet balance. Please fund your wallet.");
  assert.equal(getWalletPaymentError(30000, 30000), "");
  assert.equal(getWalletPaymentError(50000, 30000), "");
});

test("supported response shapes preserve numeric balances", () => {
  for (const response of [
    { data: { walletBalance: { available: "25000" } } },
    { data: { available: 25000 } },
    { walletBalance: { available: 25000 } },
    { available: 25000 },
  ]) assert.equal(getAvailableWalletBalance(response), 25000);
});

test("a missing or invalid balance is unavailable rather than falsely zero", () => {
  for (const available of [undefined, null, "", "invalid", Infinity, -1]) {
    const balance = getAvailableWalletBalance({ available });
    assert.equal(balance, null);
    assert.match(getWalletPaymentError(balance, 30000), /Unable to verify your wallet balance/);
  }
});

test("invalid booking totals do not pass wallet validation", () => {
  for (const total of [NaN, Infinity, 0, -1]) {
    assert.match(getWalletPaymentError(50000, total), /booking total/);
  }
});
