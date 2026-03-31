import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types

  type QuestionType = {
    #mcq;
    #fillBlank;
    #debugging;
    #outputPredict;
  };

  type Question = {
    questionText : Text;
    questionType : QuestionType;
    options : [Text];
    correctAnswer : Text;
    explanation : Text;
    wrongExplanations : [Text];
  };

  type Level = {
    levelNumber : Nat;
    stage : Text;
    title : Text;
    concept : Text;
    practiceQuestions : [Question];
    miniQuiz : [Question];
    xpReward : Nat;
    coinReward : Nat;
  };

  type BadgeType = {
    #streak;
    #levelComplete;
    #stageComplete;
    #quizMaster;
  };

  type Badge = {
    badgeType : BadgeType;
    name : Text;
    description : Text;
    dateEarned : Int;
  };

  type Certificate = {
    stage : Text;
    levelRange : Text;
    dateEarned : Int;
  };

  public type UserProfile = {
    username : Text;
    avatar : Nat;
    xp : Nat;
    coins : Nat;
    currentLevel : Nat;
    streakDays : Nat;
    lastActive : Int;
    totalBadges : Nat;
    completedLevels : [Nat];
    unlockedLevels : [Nat];
    badges : [Badge];
    certificates : [Certificate];
  };

  // Modules

  module UserProfile {
    public func compareByXp(a : (Principal, UserProfile), b : (Principal, UserProfile)) : Order.Order {
      Int.compare(b.1.xp, a.1.xp);
    };
  };

  // State

  let accessControlState : AccessControl.AccessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let levels = Map.fromArray<Nat, Level>([
    (
      1,
      {
        levelNumber = 1;
        stage = "Beginner";
        title = "Variables & Data Types";
        concept = "Introduction to Python variables and basic data types (int, float, string, bool).";
        practiceQuestions = [
          {
            questionText = "What is the result of 3 + 2 * 2 in Python?";
            questionType = #mcq;
            options = ["10", "7", "8", "9"];
            correctAnswer = "7";
            explanation = "PEMDAS applies: multiply first (2x2=4), then add 3+4=7";
            wrongExplanations = [
              "10 is incorrect - you must follow order of operations.",
              "8 is incorrect - check multiplication first.",
              "9 is incorrect - review the calculation step by step.",
            ];
          },
          {
            questionText = "Fill in the blank: To declare a variable in Python, you use the _____ keyword?";
            questionType = #fillBlank;
            options = [];
            correctAnswer = "";
            explanation = "Python uses dynamic typing, so no keyword is needed for variable declaration.";
            wrongExplanations = [];
          },
          {
            questionText = "What data type is the value \"True\" in Python?";
            questionType = #mcq;
            options = ["int", "float", "str", "bool"];
            correctAnswer = "bool";
            explanation = "\"True\" represents a boolean value (True/False)";
            wrongExplanations = [
              "int is for whole numbers.",
              "float is for decimal numbers.",
              "str is for text data.",
            ];
          },
          {
            questionText = "What is the output type of this code? x = 5.0";
            questionType = #outputPredict;
            options = [];
            correctAnswer = "float";
            explanation = "Adding .0 makes it a float/double data type.";
            wrongExplanations = [];
          },
          {
            questionText = "Which symbol is used for single-line comments in Python?";
            questionType = #mcq;
            options = ["//", "/*", "##", "#"];
            correctAnswer = "#";
            explanation = "The # symbol is used for comments.";
            wrongExplanations = [
              "// is used in other languages.",
              "/* is for multiline comments in other languages.",
              "## is not standard for single-line comments in Python.",
            ];
          },
        ];
        miniQuiz = [
          {
            questionText = "What does this code output? print(5 > 2)";
            questionType = #outputPredict;
            options = [];
            correctAnswer = "True";
            explanation = "5 is greater than 2, so it returns True.";
            wrongExplanations = [];
          },
          {
            questionText = "Which is a valid variable name in Python?";
            questionType = #mcq;
            options = ["2var", "my_var", "my-var", "Var%"];
            correctAnswer = "my_var";
            explanation = "Variable names can't start with a number and can't contain special characters like - or %.";
            wrongExplanations = [
              "2var is invalid - can't start with a number.",
              "my-var is invalid - can't use dash.",
              "Var% is invalid - can't use % symbol.",
            ];
          },
          {
            questionText = "What data type is the value \"Hello\" in Python?";
            questionType = #mcq;
            options = ["int", "str", "bool", "float"];
            correctAnswer = "str";
            explanation = "\"Hello\" is sequence of characters, making it a string (str) data type.";
            wrongExplanations = [
              "int is for numbers.",
              "bool is for True/False.",
              "float is for decimals.",
            ];
          },
        ];
        xpReward = 100;
        coinReward = 50;
      },
    ),
  ]);

  // Helper functions
  func getUserProfileInternal(caller : Principal) : UserProfile {
    switch (userProfiles.get(caller)) {
      case (null) { createDefaultProfile(caller) };
      case (?existingProfile) { existingProfile };
    };
  };

  func createDefaultProfile(_caller : Principal) : UserProfile {
    {
      username = "";
      avatar = 1;
      xp = 0;
      coins = 0;
      currentLevel = 1;
      streakDays = 0;
      lastActive = Time.now();
      totalBadges = 0;
      completedLevels = [];
      unlockedLevels = [1, 2, 3];
      badges = [];
      certificates = [];
    };
  };

  // Public functions

  public shared ({ caller }) func updateUserProfile(updatedProfile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profile");
    };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getLevel(levelNumber : Nat) : async Level {
    // Public content - accessible to all users including guests
    switch (levels.get(levelNumber)) {
      case (null) { Runtime.trap("Level not found") };
      case (?level) { level };
    };
  };

  public query ({ caller }) func getLeaderboard() : async [(Principal, UserProfile)] {
    // Public leaderboard - accessible to all users including guests
    userProfiles.toArray().sort(UserProfile.compareByXp).sliceToArray(0, 20);
  };

  public shared ({ caller }) func awardBadge(user : Principal, badge : Badge) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can award badges");
    };
    let userProfile = getUserProfileInternal(user);
    let updatedBadges = userProfile.badges.concat([badge]);
    let updatedProfile = {
      userProfile with
      badges = updatedBadges;
      totalBadges = userProfile.totalBadges + 1;
    };
    userProfiles.add(user, updatedProfile);
  };

  public query ({ caller }) func getUserBadges() : async [Badge] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access badges");
    };
    let profile = getUserProfileInternal(caller);
    profile.badges;
  };

  public shared ({ caller }) func recordCertificate(user : Principal, certificate : Certificate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record certificates");
    };
    let userProfile = getUserProfileInternal(user);
    let updatedCertificates = userProfile.certificates.concat([certificate]);
    let updatedProfile = { userProfile with certificates = updatedCertificates };
    userProfiles.add(user, updatedProfile);
  };

  public query ({ caller }) func getUserCertificates() : async [Certificate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access certificates");
    };
    let profile = getUserProfileInternal(caller);
    profile.certificates;
  };

  public shared ({ caller }) func checkDailyStreak() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check streaks");
    };
    let userProfile = getUserProfileInternal(caller);
    let currentTime = Time.now();
    let lastActive = userProfile.lastActive;
    let streak : Nat = if (currentTime - lastActive > (60 * 60 * 24 * 1_000_000_000 : Int)) {
      1;
    } else {
      userProfile.streakDays + 1;
    };
    let newProfile = {
      userProfile with
      streakDays = streak;
      lastActive = currentTime;
    };
    userProfiles.add(caller, newProfile);
    streak;
  };
};
