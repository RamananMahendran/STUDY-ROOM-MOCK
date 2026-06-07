import prisma from './config/database.js';
import { getFriends, getFriendRequests, sendFriendInvite, acceptFriendRequest, declineFriendRequest } from './modules/friendship/friendshipController.js';
import { getStudyLeaderboard, getCodingLeaderboard } from './modules/leaderboard/leaderboardController.js';
import { Response } from 'express';

const assert = (condition: unknown, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

// Mock Express response generator
const makeMockResponse = () => {
  const res: Partial<Response> = {};
  const statusPromise = new Promise<number>((resolve) => {
    res.status = (code: number) => {
      resolve(code);
      return res as Response;
    };
  });
  const jsonPromise = new Promise<any>((resolve) => {
    res.json = (data: any) => {
      resolve(data);
      return res as Response;
    };
  });
  return { res: res as Response, jsonPromise, statusPromise };
};

async function testCommunity() {
  console.log('Starting Community & Leaderboard integration diagnostics...');

  // 1. Create two test users
  const timestamp = Date.now();
  const emailA = `test_community_a_${timestamp}@test.com`;
  const emailB = `test_community_b_${timestamp}@test.com`;

  const userA = await prisma.user.create({
    data: {
      name: 'Tester Alice',
      email: emailA,
      password: 'passwordA',
      streakCount: 3,
      pomodorosTotal: 10,
      problemsSolved: 5
    }
  });

  const userB = await prisma.user.create({
    data: {
      name: 'Tester Bob',
      email: emailB,
      password: 'passwordB',
      streakCount: 1,
      pomodorosTotal: 25,
      problemsSolved: 12
    }
  });

  console.log(`Created test users. UserA: ${userA.id}, UserB: ${userB.id}`);

  try {
    // 2. Fetch friends list (should be empty initially)
    console.log('Verifying initial friends list is empty...');
    const reqGetFriends = { user: { id: userA.id } } as any;
    const { res: resGetFriends, jsonPromise: jsonGetFriends } = makeMockResponse();
    await getFriends(reqGetFriends, resGetFriends, (err) => { throw err; });
    const dataGetFriends = await jsonGetFriends;
    assert(dataGetFriends.success === true, 'Failed to fetch friends list');
    assert(dataGetFriends.data.length === 0, 'Friends list should be empty initially');
    console.log('PASS: Initial friends list is empty.');

    // 3. User A invites User B by email
    console.log('User A inviting User B...');
    const reqInvite = { user: { id: userA.id }, body: { email: emailB } } as any;
    const { res: resInvite, jsonPromise: jsonInvite } = makeMockResponse();
    await sendFriendInvite(reqInvite, resInvite, (err) => { throw err; });
    const dataInvite = await jsonInvite;
    assert(dataInvite.success === true, 'Failed to send invite');
    assert(dataInvite.isNewUser === false, 'isNewUser should be false for existing user');
    console.log('PASS: Friend invite sent successfully.');

    // 4. Verify pending requests lists
    console.log('Verifying pending requests for both users...');
    const reqRequestsA = { user: { id: userA.id } } as any;
    const { res: resRequestsA, jsonPromise: jsonRequestsA } = makeMockResponse();
    await getFriendRequests(reqRequestsA, resRequestsA, (err) => { throw err; });
    const dataRequestsA = await jsonRequestsA;
    assert(dataRequestsA.success === true, 'Failed to fetch User A requests');
    assert(dataRequestsA.incoming.length === 0, 'User A should have no incoming requests');
    assert(dataRequestsA.outgoing.length === 1, 'User A should have one outgoing request');
    assert(dataRequestsA.outgoing[0].email === emailB, 'Outgoing request target email mismatch');

    const reqRequestsB = { user: { id: userB.id } } as any;
    const { res: resRequestsB, jsonPromise: jsonRequestsB } = makeMockResponse();
    await getFriendRequests(reqRequestsB, resRequestsB, (err) => { throw err; });
    const dataRequestsB = await jsonRequestsB;
    assert(dataRequestsB.success === true, 'Failed to fetch User B requests');
    assert(dataRequestsB.incoming.length === 1, 'User B should have one incoming request');
    assert(dataRequestsB.incoming[0].email === emailA, 'Incoming request sender email mismatch');
    assert(dataRequestsB.outgoing.length === 0, 'User B should have no outgoing requests');
    console.log('PASS: Pending request state verified.');

    const friendshipId = dataRequestsB.incoming[0].friendshipId;

    // 5. User B accepts User A's request
    console.log('User B accepting request...');
    const reqAccept = { user: { id: userB.id }, params: { id: friendshipId } } as any;
    const { res: resAccept, jsonPromise: jsonAccept } = makeMockResponse();
    await acceptFriendRequest(reqAccept, resAccept, (err) => { throw err; });
    const dataAccept = await jsonAccept;
    assert(dataAccept.success === true, 'Failed to accept request');
    console.log('PASS: Friend request accepted successfully.');

    // 6. Verify friends list for both users
    console.log('Verifying users are now friends...');
    const { res: resGetFriendsA2, jsonPromise: jsonGetFriendsA2 } = makeMockResponse();
    await getFriends(reqGetFriends, resGetFriendsA2, (err) => { throw err; });
    const dataGetFriendsA2 = await jsonGetFriendsA2;
    assert(dataGetFriendsA2.data.length === 1, 'User A should have exactly one friend');
    assert(dataGetFriendsA2.data[0].email === emailB, 'User A friend email mismatch');

    const reqGetFriendsB = { user: { id: userB.id } } as any;
    const { res: resGetFriendsB2, jsonPromise: jsonGetFriendsB2 } = makeMockResponse();
    await getFriends(reqGetFriendsB, resGetFriendsB2, (err) => { throw err; });
    const dataGetFriendsB2 = await jsonGetFriendsB2;
    assert(dataGetFriendsB2.data.length === 1, 'User B should have exactly one friend');
    assert(dataGetFriendsB2.data[0].email === emailA, 'User B friend email mismatch');
    console.log('PASS: Friend list updates verified.');

    // 7. Verify leaderboard logic and sorting
    console.log('Verifying Study Leaderboard...');
    const reqStudy = { user: { id: userA.id } } as any;
    const { res: resStudy, jsonPromise: jsonStudy } = makeMockResponse();
    await getStudyLeaderboard(reqStudy, resStudy, (err) => { throw err; });
    const dataStudy = await jsonStudy;
    assert(dataStudy.success === true, 'Failed to fetch study leaderboard');
    // Bob has 25 pomodoros, Alice has 10. Bob should be ranked higher than Alice.
    const aliceRankIdx = dataStudy.data.findIndex((u: any) => u.id === userA.id);
    const bobRankIdx = dataStudy.data.findIndex((u: any) => u.id === userB.id);
    assert(aliceRankIdx !== -1 && bobRankIdx !== -1, 'Test users not found in study leaderboard');
    assert(bobRankIdx < aliceRankIdx, 'Study leaderboard sorting failed: Bob should rank higher than Alice');
    assert(dataStudy.data[aliceRankIdx].isYou === true, 'isYou check for User A study leaderboard entry failed');
    assert(dataStudy.data[bobRankIdx].isYou === false, 'isYou check for User B study leaderboard entry failed');
    console.log('PASS: Study leaderboard query and sorting verified.');

    console.log('Verifying Coding Leaderboard...');
    const reqCoding = { user: { id: userB.id } } as any;
    const { res: resCoding, jsonPromise: jsonCoding } = makeMockResponse();
    await getCodingLeaderboard(reqCoding, resCoding, (err) => { throw err; });
    const dataCoding = await jsonCoding;
    assert(dataCoding.success === true, 'Failed to fetch coding leaderboard');
    const aliceCodingRankIdx = dataCoding.data.findIndex((u: any) => u.id === userA.id);
    const bobCodingRankIdx = dataCoding.data.findIndex((u: any) => u.id === userB.id);
    assert(aliceCodingRankIdx !== -1 && bobCodingRankIdx !== -1, 'Test users not found in coding leaderboard');
    assert(bobCodingRankIdx < aliceCodingRankIdx, 'Coding leaderboard sorting failed: Bob should rank higher than Alice');
    assert(dataCoding.data[bobCodingRankIdx].isYou === true, 'isYou check for User B coding leaderboard entry failed');
    console.log('PASS: Coding leaderboard query and sorting verified.');

    // 8. Decline / Cancel request (unfriend)
    console.log('User A unfriending User B...');
    const reqUnfriend = { user: { id: userA.id }, params: { id: friendshipId } } as any;
    const { res: resUnfriend, jsonPromise: jsonUnfriend } = makeMockResponse();
    await declineFriendRequest(reqUnfriend, resUnfriend, (err) => { throw err; });
    const dataUnfriend = await jsonUnfriend;
    assert(dataUnfriend.success === true, 'Failed to unfriend');
    console.log('PASS: Unfriend action verified.');

    // 9. Verify friends list is empty again
    const { res: resGetFriendsA3, jsonPromise: jsonGetFriendsA3 } = makeMockResponse();
    await getFriends(reqGetFriends, resGetFriendsA3, (err) => { throw err; });
    const dataGetFriendsA3 = await jsonGetFriendsA3;
    assert(dataGetFriendsA3.data.length === 0, 'Friends list should be empty after unfriend');
    console.log('PASS: Friends list is empty again.');

  } finally {
    // 10. Cleanup
    console.log('Cleaning up database test records...');
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { userAId: userA.id },
          { userAId: userB.id },
          { userBId: userA.id },
          { userBId: userB.id }
        ]
      }
    });
    await prisma.user.deleteMany({
      where: {
        id: { in: [userA.id, userB.id] }
      }
    });
    console.log('Database cleanup completed.');
  }
}

testCommunity()
  .then(() => console.log('ALL COMMUNITY TESTS PASSED.'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
