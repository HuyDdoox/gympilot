import {
  PrismaClient,
  Role,
  MemberStatus,
  PlanType,
  MembershipStatus,
  BookingStatus,
  CheckInMethod,
  PaymentMethod,
  PaymentStatus,
  NotificationType,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main(): Promise<void> {
  console.log('🚀 [GymPilot] Bắt đầu khởi tạo dữ liệu mẫu (Seeding demo data)...');

  // Mật khẩu demo chung cho tất cả tài khoản mẫu
  const demoPasswordHash = await hashPassword('GymPilot@2026');

  // 1. TẠO 1 PHÒNG GYM
  console.log('  -> 1. Tạo phòng Gym mẫu...');
  const gym = await prisma.gym.upsert({
    where: { id: 'seed-gym-01' },
    update: {
      name: 'GymPilot Boutique Studio',
      address: 'Số 123 Đường Nguyễn Thị Minh Khai, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      phone: '0901234567',
      logoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80',
      openTime: '06:00',
      closeTime: '22:00',
    },
    create: {
      id: 'seed-gym-01',
      name: 'GymPilot Boutique Studio',
      address: 'Số 123 Đường Nguyễn Thị Minh Khai, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      phone: '0901234567',
      logoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80',
      openTime: '06:00',
      closeTime: '22:00',
    },
  });

  // 2. TẠO TÀI KHOẢN OWNER
  console.log('  -> 2. Tạo tài khoản Chủ phòng (Owner)...');
  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@gympilot.vn' },
    update: {
      fullName: 'Nguyễn Thế Huy',
      phone: '0901234567',
      role: Role.OWNER,
      isActive: true,
      gymId: gym.id,
      passwordHash: demoPasswordHash,
    },
    create: {
      id: 'seed-user-owner-01',
      gymId: gym.id,
      email: 'owner@gympilot.vn',
      passwordHash: demoPasswordHash,
      fullName: 'Nguyễn Thế Huy',
      phone: '0901234567',
      role: Role.OWNER,
      isActive: true,
    },
  });

  // 3. TẠO 2 TÀI KHOẢN STAFF (NHÂN VIÊN LỄ TÂN)
  console.log('  -> 3. Tạo 2 tài khoản Nhân viên (Staff)...');
  const staffData = [
    {
      id: 'seed-user-staff-01',
      email: 'staff1@gympilot.vn',
      fullName: 'Trần Thu Hà',
      phone: '0912345671',
    },
    {
      id: 'seed-user-staff-02',
      email: 'staff2@gympilot.vn',
      fullName: 'Lê Minh Tuấn',
      phone: '0912345672',
    },
  ];

  for (const s of staffData) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: {
        fullName: s.fullName,
        phone: s.phone,
        role: Role.STAFF,
        isActive: true,
        gymId: gym.id,
        passwordHash: demoPasswordHash,
      },
      create: {
        id: s.id,
        gymId: gym.id,
        email: s.email,
        passwordHash: demoPasswordHash,
        fullName: s.fullName,
        phone: s.phone,
        role: Role.STAFF,
        isActive: true,
      },
    });
  }

  // 4. TẠO 2 TRAINER (HUẤN LUYỆN VIÊN)
  console.log('  -> 4. Tạo 2 Huấn luyện viên (Trainer)...');
  const trainerData = [
    {
      userId: 'seed-user-trainer-01',
      trainerId: 'seed-trainer-01',
      email: 'trainer.mai@gympilot.vn',
      fullName: 'Mai Thị Vy An',
      phone: '0923456781',
      specialty: 'Pilates Reformer & Vinyasa Yoga',
      bio: '5 năm kinh nghiệm giảng dạy Pilates và Yoga trị liệu phục hồi cột sống.',
    },
    {
      userId: 'seed-user-trainer-02',
      trainerId: 'seed-trainer-02',
      email: 'trainer.hung@gympilot.vn',
      fullName: 'Phạm Quốc Hùng',
      phone: '0923456782',
      specialty: 'HIIT & Functional Strength',
      bio: 'Chứng chỉ HLV Quốc Tế NASM, cựu vận động viên thể thao phong trào.',
    },
  ];

  for (const t of trainerData) {
    await prisma.user.upsert({
      where: { email: t.email },
      update: {
        fullName: t.fullName,
        phone: t.phone,
        role: Role.TRAINER,
        isActive: true,
        gymId: gym.id,
        passwordHash: demoPasswordHash,
      },
      create: {
        id: t.userId,
        gymId: gym.id,
        email: t.email,
        passwordHash: demoPasswordHash,
        fullName: t.fullName,
        phone: t.phone,
        role: Role.TRAINER,
        isActive: true,
      },
    });

    await prisma.trainer.upsert({
      where: { userId: t.userId },
      update: {
        specialty: t.specialty,
        bio: t.bio,
        gymId: gym.id,
      },
      create: {
        id: t.trainerId,
        userId: t.userId,
        gymId: gym.id,
        specialty: t.specialty,
        bio: t.bio,
      },
    });
  }

  // 5. TẠO 4 GÓI TẬP (PLANS)
  console.log('  -> 5. Tạo 4 Gói tập mẫu (Plans)...');
  const plansData = [
    {
      id: 'seed-plan-monthly',
      name: 'Gói Tháng Tiêu Chuẩn (Monthly Unlimited)',
      type: PlanType.MONTHLY,
      price: 1200000,
      durationDays: 30,
      totalSessions: null,
      description: 'Tập không giới hạn tất cả các ngày trong tháng, sử dụng đầy đủ tiện ích tủ đồ và phòng tắm.',
      isActive: true,
    },
    {
      id: 'seed-plan-quarterly',
      name: 'Gói Quý Hội Viên Vàng (Quarterly Premium)',
      type: PlanType.QUARTERLY,
      price: 3200000,
      durationDays: 90,
      totalSessions: null,
      description: 'Tập không giới hạn 3 tháng, tặng kèm 2 buổi huấn luyện viên 1:1 định hướng lộ trình.',
      isActive: true,
    },
    {
      id: 'seed-plan-session-pack',
      name: 'Thẻ 20 Buổi Pilates & HIIT (Session Pack)',
      type: PlanType.SESSION_PACK,
      price: 2000000,
      durationDays: 60,
      totalSessions: 20,
      description: 'Áp dụng cho 20 buổi học lớp nhóm có huấn luyện viên hướng dẫn, thời hạn 60 ngày.',
      isActive: true,
    },
    {
      id: 'seed-plan-drop-in',
      name: 'Vé Lẻ Trải Nghiệm 1 Buổi (Drop-in Single)',
      type: PlanType.DROP_IN,
      price: 150000,
      durationDays: 1,
      totalSessions: 1,
      description: 'Vé tập trải nghiệm 1 buổi tự do hoặc tham gia 1 buổi học nhóm trong ngày.',
      isActive: true,
    },
  ];

  for (const p of plansData) {
    await prisma.plan.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        type: p.type,
        price: p.price,
        durationDays: p.durationDays,
        totalSessions: p.totalSessions,
        description: p.description,
        isActive: p.isActive,
        gymId: gym.id,
      },
      create: {
        id: p.id,
        gymId: gym.id,
        name: p.name,
        type: p.type,
        price: p.price,
        durationDays: p.durationDays,
        totalSessions: p.totalSessions,
        description: p.description,
        isActive: p.isActive,
      },
    });
  }

  // 6. TẠO 20 HỘI VIÊN (MEMBERS)
  console.log('  -> 6. Tạo 20 Hội viên mẫu (Members)...');
  const membersSeedConfig = [
    { num: 1, name: 'Nguyễn Văn An', gender: 'Nam', status: MemberStatus.ACTIVE, planId: 'seed-plan-monthly' },
    { num: 2, name: 'Trần Thị Bích', gender: 'Nữ', status: MemberStatus.ACTIVE, planId: 'seed-plan-monthly' },
    { num: 3, name: 'Lê Hoàng Cường', gender: 'Nam', status: MemberStatus.ACTIVE, planId: 'seed-plan-monthly' },
    { num: 4, name: 'Phạm Minh Dung', gender: 'Nữ', status: MemberStatus.ACTIVE, planId: 'seed-plan-monthly' },
    { num: 5, name: 'Vũ Đức Em', gender: 'Nam', status: MemberStatus.ACTIVE, planId: 'seed-plan-monthly' },
    { num: 6, name: 'Đỗ Thị Giang', gender: 'Nữ', status: MemberStatus.ACTIVE, planId: 'seed-plan-monthly' },
    { num: 7, name: 'Bùi Hải Hưng', gender: 'Nam', status: MemberStatus.ACTIVE, planId: 'seed-plan-quarterly' },
    { num: 8, name: 'Ngô Thu Hương', gender: 'Nữ', status: MemberStatus.ACTIVE, planId: 'seed-plan-quarterly' },
    { num: 9, name: 'Dương Tấn Khang', gender: 'Nam', status: MemberStatus.ACTIVE, planId: 'seed-plan-quarterly' },
    { num: 10, name: 'Lý Mỹ Linh', gender: 'Nữ', status: MemberStatus.ACTIVE, planId: 'seed-plan-quarterly' },
    { num: 11, name: 'Hoàng Trọng Nam', gender: 'Nam', status: MemberStatus.ACTIVE, planId: 'seed-plan-session-pack' },
    { num: 12, name: 'Trịnh Cẩm Oanh', gender: 'Nữ', status: MemberStatus.ACTIVE, planId: 'seed-plan-session-pack' },
    { num: 13, name: 'Mai Văn Phúc', gender: 'Nam', status: MemberStatus.ACTIVE, planId: 'seed-plan-session-pack' },
    { num: 14, name: 'Đoàn Như Quỳnh', gender: 'Nữ', status: MemberStatus.ACTIVE, planId: 'seed-plan-session-pack' },
    { num: 15, name: 'Võ Minh Quân', gender: 'Nam', status: MemberStatus.ACTIVE, planId: 'seed-plan-session-pack' },
    { num: 16, name: 'Phan Bảo Sơn', gender: 'Nam', status: MemberStatus.ACTIVE, planId: 'seed-plan-session-pack' },
    { num: 17, name: 'Tạ Thanh Thảo', gender: 'Nữ', status: MemberStatus.ACTIVE, planId: 'seed-plan-drop-in' },
    { num: 18, name: 'Lâm Quốc Uy', gender: 'Nam', status: MemberStatus.EXPIRED, planId: 'seed-plan-monthly' },
    { num: 19, name: 'Đinh Diệu Vy', gender: 'Nữ', status: MemberStatus.EXPIRED, planId: 'seed-plan-session-pack' },
    { num: 20, name: 'Trương Gia Yên', gender: 'Nữ', status: MemberStatus.PAUSED, planId: 'seed-plan-quarterly' },
  ];

  const now = new Date();
  const createdMemberIds: string[] = [];

  for (const m of membersSeedConfig) {
    const pad = m.num.toString().padStart(2, '0');
    const email = `member${pad}@gympilot.vn`;
    const userId = `seed-user-member-${pad}`;
    const memberId = `seed-member-${pad}`;
    const phone = `09345678${pad}`;
    const qrToken = `qr-gympilot-member-${pad}`;

    await prisma.user.upsert({
      where: { email },
      update: {
        fullName: m.name,
        phone,
        role: Role.MEMBER,
        isActive: m.status !== MemberStatus.EXPIRED,
        gymId: gym.id,
        passwordHash: demoPasswordHash,
      },
      create: {
        id: userId,
        gymId: gym.id,
        email,
        passwordHash: demoPasswordHash,
        fullName: m.name,
        phone,
        role: Role.MEMBER,
        isActive: m.status !== MemberStatus.EXPIRED,
      },
    });

    await prisma.member.upsert({
      where: { userId },
      update: {
        gender: m.gender,
        status: m.status,
        qrToken,
        notes: `Hội viên số ${m.num} đăng ký qua cổng tiếp nhận.`,
        dateOfBirth: new Date(1995, (m.num % 12), (m.num % 27) + 1),
        gymId: gym.id,
      },
      create: {
        id: memberId,
        userId,
        gymId: gym.id,
        gender: m.gender,
        status: m.status,
        qrToken,
        notes: `Hội viên số ${m.num} đăng ký qua cổng tiếp nhận.`,
        dateOfBirth: new Date(1995, (m.num % 12), (m.num % 27) + 1),
        joinedAt: new Date(now.getTime() - m.num * 86400000 * 3),
      },
    });

    createdMemberIds.push(memberId);

    // Tạo Membership & Payment tương ứng cho hội viên
    const membershipId = `seed-membership-${pad}`;
    const paymentId = `seed-payment-${pad}`;

    let startDate = new Date(now.getTime() - 10 * 86400000);
    let endDate: Date | null = new Date(now.getTime() + 20 * 86400000);
    let sessionsLeft: number | null = null;
    let memStatus: MembershipStatus = MembershipStatus.ACTIVE;

    if (m.planId === 'seed-plan-session-pack') {
      sessionsLeft = m.status === MemberStatus.EXPIRED ? 0 : 15;
    }

    if (m.status === MemberStatus.EXPIRED) {
      memStatus = MembershipStatus.EXPIRED;
      startDate = new Date(now.getTime() - 60 * 86400000);
      endDate = new Date(now.getTime() - 10 * 86400000);
    } else if (m.status === MemberStatus.PAUSED) {
      memStatus = MembershipStatus.ACTIVE;
    }

    const membership = await prisma.membership.upsert({
      where: { id: membershipId },
      update: {
        planId: m.planId,
        startDate,
        endDate,
        sessionsLeft,
        status: memStatus,
      },
      create: {
        id: membershipId,
        memberId,
        planId: m.planId,
        startDate,
        endDate,
        sessionsLeft,
        status: memStatus,
      },
    });

    await prisma.payment.upsert({
      where: { id: paymentId },
      update: {
        amount: m.planId === 'seed-plan-monthly' ? 1200000 : m.planId === 'seed-plan-quarterly' ? 3200000 : 2000000,
        status: PaymentStatus.PAID,
        paidAt: startDate,
        createdById: ownerUser.id,
      },
      create: {
        id: paymentId,
        membershipId: membership.id,
        amount: m.planId === 'seed-plan-monthly' ? 1200000 : m.planId === 'seed-plan-quarterly' ? 3200000 : 2000000,
        method: PaymentMethod.BANK_TRANSFER,
        status: PaymentStatus.PAID,
        paidAt: startDate,
        createdById: ownerUser.id,
        note: `Thanh toán thành công gói tập cho hội viên ${m.name}`,
      },
    });
  }

  // 7. TẠO 4 LỚP HỌC (GYM CLASSES)
  console.log('  -> 7. Tạo 4 Lớp học (Gym Classes)...');
  const classesData = [
    {
      id: 'seed-class-pilates',
      name: 'Pilates Reformer Core Foundation',
      description: 'Tập luyện sức mạnh vùng lõi, cải thiện tư thế và sự dẻo dai trên máy Reformer.',
      capacity: 8,
      durationMin: 60,
      requiresSession: true,
    },
    {
      id: 'seed-class-yoga',
      name: 'Vinyasa Flow Yoga Buổi Sáng',
      description: 'Chuỗi động tác kết hợp hơi thở nhịp nhàng giúp đánh thức năng lượng tích cực.',
      capacity: 15,
      durationMin: 60,
      requiresSession: true,
    },
    {
      id: 'seed-class-hiit',
      name: 'HIIT Fat Burning & Cardio',
      description: 'Đốt mỡ tối đa với các chu kỳ vận động cường độ cao ngắt quãng.',
      capacity: 12,
      durationMin: 45,
      requiresSession: true,
    },
    {
      id: 'seed-class-open-gym',
      name: 'Tự Do Gym & Cardio Tự Luyện',
      description: 'Sử dụng tự do khu vực tạ đơn, máy khối và máy chạy bộ.',
      capacity: 30,
      durationMin: 120,
      requiresSession: false,
    },
  ];

  for (const c of classesData) {
    await prisma.gymClass.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        description: c.description,
        capacity: c.capacity,
        durationMin: c.durationMin,
        requiresSession: c.requiresSession,
        isActive: true,
        gymId: gym.id,
      },
      create: {
        id: c.id,
        gymId: gym.id,
        name: c.name,
        description: c.description,
        capacity: c.capacity,
        durationMin: c.durationMin,
        requiresSession: c.requiresSession,
        isActive: true,
      },
    });
  }

  // 8. TẠO 10 BUỔI HỌC (CLASS SESSIONS)
  console.log('  -> 8. Tạo 10 Buổi học mẫu (Class Sessions)...');
  const sessionsSeedConfig = [
    {
      id: 'seed-session-01',
      classId: 'seed-class-pilates',
      trainerId: 'seed-trainer-01',
      dayOffset: 0,
      startHour: 7,
      startMin: 0,
      capacity: 8,
      bookedCount: 5,
    },
    {
      id: 'seed-session-02',
      classId: 'seed-class-yoga',
      trainerId: 'seed-trainer-01',
      dayOffset: 0,
      startHour: 9,
      startMin: 0,
      capacity: 15,
      bookedCount: 10,
    },
    {
      id: 'seed-session-03',
      classId: 'seed-class-hiit',
      trainerId: 'seed-trainer-02',
      dayOffset: 0,
      startHour: 17,
      startMin: 30,
      capacity: 12,
      bookedCount: 8,
    },
    {
      id: 'seed-session-04',
      classId: 'seed-class-pilates',
      trainerId: 'seed-trainer-01',
      dayOffset: 1,
      startHour: 8,
      startMin: 0,
      capacity: 8,
      bookedCount: 6,
    },
    {
      id: 'seed-session-05',
      classId: 'seed-class-hiit',
      trainerId: 'seed-trainer-02',
      dayOffset: 1,
      startHour: 18,
      startMin: 0,
      capacity: 12,
      bookedCount: 9,
    },
    {
      id: 'seed-session-06',
      classId: 'seed-class-yoga',
      trainerId: 'seed-trainer-01',
      dayOffset: 2,
      startHour: 6,
      startMin: 30,
      capacity: 15,
      bookedCount: 7,
    },
    {
      id: 'seed-session-07',
      classId: 'seed-class-pilates',
      trainerId: 'seed-trainer-01',
      dayOffset: 2,
      startHour: 17,
      startMin: 0,
      capacity: 8,
      bookedCount: 8,
    },
    {
      id: 'seed-session-08',
      classId: 'seed-class-hiit',
      trainerId: 'seed-trainer-02',
      dayOffset: 3,
      startHour: 18,
      startMin: 30,
      capacity: 12,
      bookedCount: 6,
    },
    {
      id: 'seed-session-09',
      classId: 'seed-class-yoga',
      trainerId: 'seed-trainer-01',
      dayOffset: 4,
      startHour: 8,
      startMin: 30,
      capacity: 15,
      bookedCount: 11,
    },
    {
      id: 'seed-session-10',
      classId: 'seed-class-pilates',
      trainerId: 'seed-trainer-01',
      dayOffset: 5,
      startHour: 9,
      startMin: 0,
      capacity: 8,
      bookedCount: 4,
    },
  ];

  for (const cs of sessionsSeedConfig) {
    const startsAt = new Date(now);
    startsAt.setDate(now.getDate() + cs.dayOffset);
    startsAt.setHours(cs.startHour, cs.startMin, 0, 0);

    const endsAt = new Date(startsAt);
    endsAt.setMinutes(startsAt.getMinutes() + (cs.classId === 'seed-class-hiit' ? 45 : 60));

    await prisma.classSession.upsert({
      where: { id: cs.id },
      update: {
        classId: cs.classId,
        trainerId: cs.trainerId,
        startsAt,
        endsAt,
        capacity: cs.capacity,
        bookedCount: cs.bookedCount,
      },
      create: {
        id: cs.id,
        classId: cs.classId,
        trainerId: cs.trainerId,
        startsAt,
        endsAt,
        capacity: cs.capacity,
        bookedCount: cs.bookedCount,
      },
    });

    // Tạo Booking mẫu cho các hội viên đầu tiên vào session đầu tiên
    if (cs.id === 'seed-session-01') {
      for (let i = 0; i < 4; i++) {
        const mId = createdMemberIds[i];
        await prisma.booking.upsert({
          where: {
            memberId_sessionId: {
              memberId: mId,
              sessionId: cs.id,
            },
          },
          update: {
            status: BookingStatus.BOOKED,
          },
          create: {
            id: `seed-booking-01-${i + 1}`,
            memberId: mId,
            sessionId: cs.id,
            status: BookingStatus.BOOKED,
          },
        });
      }
    }
  }

  // 9. TẠO CHECK-IN VÀ THÔNG BÁO MẪU
  console.log('  -> 9. Tạo Check-in & Thông báo (Notifications) mẫu...');
  const checkInMember = createdMemberIds[0];
  const checkInDate = new Date(now);
  checkInDate.setHours(8, 15, 0, 0);

  await prisma.checkIn.upsert({
    where: {
      memberId_createdAt: {
        memberId: checkInMember,
        createdAt: checkInDate,
      },
    },
    update: {
      method: CheckInMethod.QR,
      note: 'Hội viên tự quét mã QR tại quầy tiếp tân',
    },
    create: {
      id: 'seed-checkin-01',
      memberId: checkInMember,
      method: CheckInMethod.QR,
      note: 'Hội viên tự quét mã QR tại quầy tiếp tân',
      createdAt: checkInDate,
    },
  });

  await prisma.notification.upsert({
    where: { id: 'seed-noti-01' },
    update: {
      title: 'Xác nhận đặt lớp thành công',
      content: 'Bạn đã đăng ký tham gia lớp Pilates Reformer Core Foundation vào lúc 07:00.',
      type: NotificationType.BOOKING_CONFIRMATION,
      isRead: false,
    },
    create: {
      id: 'seed-noti-01',
      memberId: checkInMember,
      type: NotificationType.BOOKING_CONFIRMATION,
      title: 'Xác nhận đặt lớp thành công',
      content: 'Bạn đã đăng ký tham gia lớp Pilates Reformer Core Foundation vào lúc 07:00.',
      isRead: false,
    },
  });

  console.log('✅ [GymPilot] Hoàn tất nạp dữ liệu mẫu (Seeding completed successfully):');
  console.log('   - 1 Gym: GymPilot Boutique Studio');
  console.log('   - 1 Owner (owner@gympilot.vn / GymPilot@2026)');
  console.log('   - 2 Staff (staff1@gympilot.vn, staff2@gympilot.vn / GymPilot@2026)');
  console.log('   - 2 Trainer (trainer.mai@gympilot.vn, trainer.hung@gympilot.vn / GymPilot@2026)');
  console.log('   - 20 Members (member01@gympilot.vn -> member20@gympilot.vn / GymPilot@2026)');
  console.log('   - 4 Plans (Monthly, Quarterly, Session Pack, Drop-in)');
  console.log('   - 4 GymClasses & 10 ClassSessions trong tuần');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi nạp dữ liệu mẫu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
