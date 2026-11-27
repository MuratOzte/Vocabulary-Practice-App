use std::collections::HashMap;

pub struct Quota {
    pub used: u64,
    pub limit: u64,
    pub suspended: bool,
}

pub fn consume(quotas: &mut HashMap<String, Quota>, owner: &str, units: u64) -> Result<u64, &'static str> {
    let quota = quotas.get_mut(owner).ok_or("unknown owner")?;
    if quota.suspended { return Err("suspended"); }
    let remaining = quota.limit.saturating_sub(quota.used);
    if units > remaining { return Err("quota exceeded"); }
    quota.used += units;
    Ok(quota.limit.saturating_sub(quota.used))
}

pub fn active_owners(quotas: &HashMap<String, Quota>) -> Vec<String> {
    let mut owners: Vec<_> = quotas.iter()
        .filter(|(_, quota)| !quota.suspended && quota.used < quota.limit)
        .map(|(owner, _)| owner.clone())
        .collect();
    owners.sort();
    owners
}

pub fn retry_after(attempt: u32) -> u64 {
    let bounded = attempt.min(10);
    100 * (1_u64 << bounded)
}
