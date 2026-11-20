/**
 * Backward compatibility re-export barrel for Member Data.
 * All static data has been architecturally decoupled into modular files under:
 * `apps/web/src/features/member/data/`
 */

import {
  memberUserProfileData,
  upcomingClassData,
  weeklyActivityData,
  whyChooseGymPilotData,
  paymentTransactionsData,
  checkInHistoryData,
} from '@/features/member/data/member-home.data';
import { featuredClassesData } from '@/features/member/data/classes.data';
import { membershipPlansData } from '@/features/member/data/membership-plans.data';
import { notificationsData } from '@/features/member/data/notifications.data';
import { testimonialsData } from '@/features/member/data/testimonials.data';
import { scheduleClassesData } from '@/features/member/data/member-schedule.data';

export * from '@/features/member/data';

export const memberMockData = {
  user: memberUserProfileData,
  upcomingClass: upcomingClassData,
  weeklyActivity: weeklyActivityData,
  notifications: notificationsData,
  featuredClasses: featuredClassesData,
  membershipPlans: membershipPlansData,
  whyChooseUs: whyChooseGymPilotData,
  testimonials: testimonialsData,
  scheduleClasses: scheduleClassesData,
  paymentHistory: paymentTransactionsData,
  checkInHistory: checkInHistoryData,
};

export default memberMockData;
