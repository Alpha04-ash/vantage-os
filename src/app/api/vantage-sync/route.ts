import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db.json");

export async function GET() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ users: {} });
    }
    const rawData = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(rawData);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Local database read error:", error);
    return NextResponse.json({ error: "Failed to read database" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Read existing database content if it exists
    let existingData: any = { users: {} };
    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        existingData = JSON.parse(raw);
      } catch (e) {
        console.error("Error parsing existing db.json:", e);
      }
    }

    // 2. Merge the users dictionary to preserve registrations
    const mergedUsers = { ...existingData.users, ...body.users };

    // 3. If a currentUser is active in the incoming save, selectively update their detailed fields
    if (body.currentUser && body.currentUser.operatorId) {
      const opId = body.currentUser.operatorId;
      mergedUsers[opId] = {
        ...mergedUsers[opId],
        ...body.users[opId],
        // Direct synchronization of active session parameters to prevent state drift
        balance: body.balance !== undefined ? body.balance : mergedUsers[opId]?.balance,
        portfolio: body.portfolio !== undefined ? body.portfolio : mergedUsers[opId]?.portfolio,
        learningXP: body.learningXP !== undefined ? body.learningXP : mergedUsers[opId]?.learningXP,
        impactPoints: body.impactPoints !== undefined ? body.impactPoints : mergedUsers[opId]?.impactPoints,
        portfolioAudit: body.portfolioAudit !== undefined ? body.portfolioAudit : mergedUsers[opId]?.portfolioAudit,
        academyDirectives: body.academyDirectives !== undefined ? body.academyDirectives : mergedUsers[opId]?.academyDirectives,
        infrastructure: body.infrastructure !== undefined ? body.infrastructure : mergedUsers[opId]?.infrastructure,
        savingsDeposited: body.savingsDeposited !== undefined ? body.savingsDeposited : mergedUsers[opId]?.savingsDeposited,
        activeLoan: body.activeLoan !== undefined ? body.activeLoan : mergedUsers[opId]?.activeLoan,
        properties: body.properties !== undefined ? body.properties : mergedUsers[opId]?.properties,
        fiscalDays: body.fiscalDays !== undefined ? body.fiscalDays : mergedUsers[opId]?.fiscalDays,
        achievements: body.achievements !== undefined ? body.achievements : mergedUsers[opId]?.achievements
      };
    }

    // 4. Construct updated database document
    const updatedData = {
      ...existingData,
      users: mergedUsers,
      // Global fallback trackers (for backwards compatibility/inspections)
      currentUser: body.currentUser || existingData.currentUser,
      isAuthenticated: body.isAuthenticated !== undefined ? body.isAuthenticated : existingData.isAuthenticated,
      balance: body.balance !== undefined ? body.balance : existingData.balance,
      portfolio: body.portfolio !== undefined ? body.portfolio : existingData.portfolio,
      learningXP: body.learningXP !== undefined ? body.learningXP : existingData.learningXP,
      impactPoints: body.impactPoints !== undefined ? body.impactPoints : existingData.impactPoints,
      portfolioAudit: body.portfolioAudit !== undefined ? body.portfolioAudit : existingData.portfolioAudit,
      academyDirectives: body.academyDirectives !== undefined ? body.academyDirectives : existingData.academyDirectives,
      infrastructure: body.infrastructure !== undefined ? body.infrastructure : existingData.infrastructure,
      savingsDeposited: body.savingsDeposited !== undefined ? body.savingsDeposited : existingData.savingsDeposited,
      activeLoan: body.activeLoan !== undefined ? body.activeLoan : existingData.activeLoan,
      properties: body.properties !== undefined ? body.properties : existingData.properties,
      fiscalDays: body.fiscalDays !== undefined ? body.fiscalDays : existingData.fiscalDays,
      achievements: body.achievements !== undefined ? body.achievements : existingData.achievements
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(updatedData, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Local database write error:", error);
    return NextResponse.json({ error: "Failed to write database" }, { status: 500 });
  }
}
