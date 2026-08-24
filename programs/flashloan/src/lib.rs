//! Flashloan Orchestrator (stub)
//!
//! In production this program would:
//!   1. Borrow from a lending protocol (e.g. Solend, Kamino).
//!   2. Execute the arbitrage / swap sequence atomically.
//!   3. Repay the loan + fee in the same transaction.
//!
//! This stub validates the profit precondition and emits an event.

use anchor_lang::prelude::*;

declare_id!("F1ash1oan1111111111111111111111111111111111");

#[program]
pub mod flashloan {
    use super::*;

    /// Simulate a flashloan-style execution.
    /// `expected_profit_lamports` must be > 0 after all fees.
    pub fn execute(
        ctx: Context<Execute>,
        borrow_amount: u64,
        expected_profit_lamports: i64,
    ) -> Result<()> {
        require!(
            expected_profit_lamports > 0,
            FlashloanError::NegativeProfit,
        );
        msg!(
            "Flashloan execute: borrow={} lamports, expected_profit={} lamports, executor={}",
            borrow_amount,
            expected_profit_lamports,
            ctx.accounts.executor.key(),
        );
        // TODO: CPI to lending protocol borrow, swap, repay.
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Execute<'info> {
    #[account(mut)]
    pub executor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum FlashloanError {
    #[msg("Expected profit is zero or negative — aborting to protect capital")]
    NegativeProfit,
}
