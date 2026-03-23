/**
 * Which plan cards stay unblurred when a recommendation exists:
 * the recommended tier + the next-smaller tier (except Starter-only: only Starter).
 * Enterprise recommended → Business + Enterprise unlocked.
 */

import type { BillingCycle, EnterprisePlan, Plan } from '../types';

export function isEnterprisePlan(plan: Plan | EnterprisePlan | null | undefined): plan is EnterprisePlan {
  return plan != null && (plan as EnterprisePlan).isEnterprise === true;
}

/** Plan names in ascending tier order (smaller quota first). */
export function getRegularTierOrder(billingCycle: BillingCycle): readonly string[] {
  return billingCycle === 'annual'
    ? (['Starter', 'Growth', 'Pro', 'Business'] as const)
    : (['Growth', 'Pro', 'Business'] as const);
}

/**
 * Names that should not be blurred when this plan is recommended (includes companion tier).
 */
export function getUnlockedPlanNamesForRecommendation(
  recommended: Plan | EnterprisePlan,
  billingCycle: BillingCycle
): Set<string> {
  if (isEnterprisePlan(recommended)) {
    return new Set(['Enterprise', 'Business']);
  }

  const tierOrder = getRegularTierOrder(billingCycle);
  const name = recommended.name;

  if (name === 'Starter') {
    return new Set(['Starter']);
  }

  const idx = tierOrder.indexOf(name);
  if (idx === -1) {
    return new Set([name]);
  }

  const out = new Set<string>([name]);
  if (idx > 0) {
    out.add(tierOrder[idx - 1]);
  }
  return out;
}

/**
 * Left-to-right order for unlocked regular cards: **recommended first**, then the smaller
 * “why not this?” companion tier. Enterprise is not included (handled separately).
 */
export function getUnlockedRegularCarouselOrder(
  unlockedNames: Set<string>,
  recommended: Plan | EnterprisePlan,
  billingCycle: BillingCycle
): string[] {
  if (isEnterprisePlan(recommended)) {
    return ['Business'];
  }

  const tierOrder = getRegularTierOrder(billingCycle);
  const name = recommended.name;

  if (name === 'Starter') {
    return ['Starter'];
  }

  const idx = tierOrder.indexOf(name);
  if (idx === -1) {
    return [name];
  }
  if (idx === 0) {
    return [name];
  }

  const companion = tierOrder[idx - 1];
  if (unlockedNames.has(companion)) {
    return [name, companion];
  }
  return [name];
}

/**
 * Full carousel slide order: unlocked pair first (**recommended** → companion tier), then locked
 * regular tiers, then Enterprise (Enterprise slide first when Enterprise is recommended, then Business).
 */
export function buildCarouselItems(
  billingCycle: BillingCycle,
  planEntries: [string, Plan][],
  hasCalculation: boolean,
  uiRecommendedPlan: Plan | EnterprisePlan | null,
  enterprisePlanForCard: EnterprisePlan
): Array<{ type: 'enterprise' | 'regular'; key: string; plan: any }> {
  if (!hasCalculation || !uiRecommendedPlan) {
    const regular = planEntries.map(([key, plan]) => ({ type: 'regular' as const, key, plan }));
    return [...regular, { type: 'enterprise' as const, key: 'enterprise', plan: enterprisePlanForCard }];
  }

  const unlocked = getUnlockedPlanNamesForRecommendation(uiRecommendedPlan, billingCycle);
  const byName = new Map(planEntries.map(([k, p]) => [p.name, { key: k, plan: p }]));
  const fullOrder = getRegularTierOrder(billingCycle);

  if (isEnterprisePlan(uiRecommendedPlan)) {
    const out: Array<{ type: 'enterprise' | 'regular'; key: string; plan: any }> = [];
    out.push({ type: 'enterprise', key: 'enterprise', plan: enterprisePlanForCard });
    const biz = byName.get('Business');
    if (biz) {
      out.push({ type: 'regular', key: biz.key, plan: biz.plan });
    }
    for (const n of fullOrder) {
      if (n === 'Business') continue;
      const e = byName.get(n);
      if (e) out.push({ type: 'regular', key: e.key, plan: e.plan });
    }
    return out;
  }

  const unlockedOrder = getUnlockedRegularCarouselOrder(unlocked, uiRecommendedPlan, billingCycle);
  const out: Array<{ type: 'enterprise' | 'regular'; key: string; plan: any }> = [];
  const seen = new Set<string>();

  for (const n of unlockedOrder) {
    const e = byName.get(n);
    if (e) {
      out.push({ type: 'regular', key: e.key, plan: e.plan });
      seen.add(n);
    }
  }

  for (const n of fullOrder) {
    if (!unlocked.has(n)) {
      const e = byName.get(n);
      if (e && !seen.has(n)) {
        out.push({ type: 'regular', key: e.key, plan: e.plan });
        seen.add(n);
      }
    }
  }

  for (const [key, plan] of planEntries) {
    if (!seen.has(plan.name)) {
      out.push({ type: 'regular', key, plan });
      seen.add(plan.name);
    }
  }

  out.push({ type: 'enterprise', key: 'enterprise', plan: enterprisePlanForCard });
  return out;
}
