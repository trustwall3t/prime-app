"use server";

import { db } from '@/lib/db';
import { FirstTimeProfileSchema } from '../../../schema/UserSchema';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { refreshRankingChain } from '@/lib/ranking';
import {
	findUserByReferralCode,
	normalizeReferralCode,
} from '@/lib/referrals';
import { revalidatePath } from 'next/cache';

export const submitFirstTimeProfile = async (
  formData: z.infer<typeof FirstTimeProfileSchema>
) => {
  const validated = FirstTimeProfileSchema.safeParse(formData);
  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const userId = session.user.id;

  const currentUser = await db.user.findUnique({
    where: { id: userId },
    select: { referrerId: true, refcode: true },
  });

  if (!currentUser) return { error: 'User not found' };

  const referralInput = normalizeReferralCode(validated.data.referralCode);
  let referrer = null;

  if (referralInput && !currentUser.referrerId) {
    if (currentUser.refcode && referralInput === normalizeReferralCode(currentUser.refcode)) {
      return { error: 'You cannot use your own referral code.' };
    }

    referrer = await findUserByReferralCode(referralInput);

    if (!referrer) {
      return { error: 'Referral code not found. Check the code and try again.' };
    }

    if (referrer.id === userId) {
      return { error: 'You cannot use your own referral code.' };
    }
  }

  const updateData: Record<string, unknown> = {
    name: `${validated.data.firstName}${validated.data.lastName ? ' ' + validated.data.lastName : ''}`,
    address: validated.data.address,
    country: validated.data.country,
    yearlyIncomeRange: validated.data.yearlyIncomeRange,
    AccountType: validated.data.AccountType,
    ethAddress: validated.data.ethAddress,
    btcAddress: validated.data.btcAddress,
    usdtAddress: validated.data.usdtAddress,
    isFirstLogin: false,
  };

  if (referrer && !currentUser.referrerId) {
    updateData.referrerId = referrer.id;
    await db.user.update({
      where: { id: referrer.id },
      data: { referralsCount: { increment: 1 } },
    });
    await refreshRankingChain(referrer.id);
  }

  const user = await db.user.update({ where: { id: userId }, data: updateData });

  await refreshRankingChain(userId);

  revalidatePath('/dashboard/ranking');
  revalidatePath('/dashboard/referrals');

  return { success: true, user };
};
