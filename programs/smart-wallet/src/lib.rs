//! Smart Wallet program
//!
//! Manages sub-accounts and on-chain authorization for automated strategy agents.
//! Each user gets one SmartWallet account that controls execution permissions.

use anchor_lang::prelude::*;

declare_id!("SW1tWa11et1111111111111111111111111111111111");

#[program]
pub mod smart_wallet {
    use super::*;

    /// Initialize a new SmartWallet for the caller.
    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> Result<()> {
        let wallet = &mut ctx.accounts.smart_wallet;
        wallet.owner = ctx.accounts.owner.key();
        wallet.bump = bump;
        wallet.paused = false;
        wallet.sub_accounts = vec![];
        msg!("SmartWallet initialized for {}", wallet.owner);
        Ok(())
    }

    /// Add a sub-account (e.g. bot wallet) that is allowed to execute on behalf of owner.
    pub fn add_sub_account(ctx: Context<ManageSubAccount>, sub: Pubkey) -> Result<()> {
        let wallet = &mut ctx.accounts.smart_wallet;
        require!(!wallet.sub_accounts.contains(&sub), SmartWalletError::AlreadyExists);
        wallet.sub_accounts.push(sub);
        Ok(())
    }

    /// Remove a sub-account.
    pub fn remove_sub_account(ctx: Context<ManageSubAccount>, sub: Pubkey) -> Result<()> {
        let wallet = &mut ctx.accounts.smart_wallet;
        wallet.sub_accounts.retain(|k| k != &sub);
        Ok(())
    }

    /// Pause / unpause all automated execution.
    pub fn set_paused(ctx: Context<ManageSubAccount>, paused: bool) -> Result<()> {
        ctx.accounts.smart_wallet.paused = paused;
        Ok(())
    }
}

// ── Accounts ─────────────────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = owner,
        space = SmartWallet::LEN,
        seeds = [b"smart-wallet", owner.key().as_ref()],
        bump,
    )]
    pub smart_wallet: Account<'info, SmartWallet>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ManageSubAccount<'info> {
    #[account(
        mut,
        seeds = [b"smart-wallet", owner.key().as_ref()],
        bump = smart_wallet.bump,
        has_one = owner,
    )]
    pub smart_wallet: Account<'info, SmartWallet>,
    pub owner: Signer<'info>,
}

// ── State ────────────────────────────────────────────────────────────────────

#[account]
pub struct SmartWallet {
    pub owner: Pubkey,
    pub bump: u8,
    pub paused: bool,
    /// Up to 8 authorized sub-accounts
    pub sub_accounts: Vec<Pubkey>,
}

impl SmartWallet {
    // 8 (discriminator) + 32 (owner) + 1 (bump) + 1 (paused) + 4 + 32*8 (sub_accounts vec)
    pub const LEN: usize = 8 + 32 + 1 + 1 + 4 + 32 * 8;
}

// ── Errors ───────────────────────────────────────────────────────────────────

#[error_code]
pub enum SmartWalletError {
    #[msg("Sub-account already exists")]
    AlreadyExists,
}
