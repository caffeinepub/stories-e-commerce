import Array "mo:core/Array";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Set "mo:core/Set";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();
  type CartItem = {
    productId : Text;
    quantity : Nat;
    selectedVariant : Text;
  };

  type Cart = {
    items : [CartItem];
    createdAt : Int;
  };

  type Product = {
    id : Text;
    name : Text;
    price : Float;
    description : Text;
    image : Storage.ExternalBlob;
    videoUrl : Text;
    category : Text;
    variants : [Text];
    featured : Bool;
    createdAt : Int;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : { #less; #equal; #greater } {
      Text.compare(p1.id, p2.id);
    };
  };

  type QuizSubmission = {
    userId : Principal;
    answers : [Text];
    recommendedCategories : [Text];
    timestamp : Int;
  };

  public type StyleSurvey = {
    userId : Principal;
    figure : Text;
    proportions : Text;
    skinTone : Text;
    eyeColor : Text;
    hairColor : Text;
    hairTexture : Text;
    stylePreference : Text;
    colorPalette : Text;
    timestamp : Int;
  };

  public type EcommerceStats = {
    totalProducts : Nat;
    totalOrders : Nat;
    featuredProducts : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    shippingAddress : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let products = List.empty<Product>();
  let carts = List.empty<(Principal, Cart)>();
  let quizSubmissions = List.empty<QuizSubmission>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let styleSurveys = Map.empty<Principal, StyleSurvey>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // PRODUCT MANAGEMENT

  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    products.add(product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    let filtered = products.filter(
      func(p) {
        p.id != product.id;
      }
    );
    filtered.add(product);
    products.clear();
    products.addAll(filtered.values());
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    let filtered = products.filter(
      func(p) {
        p.id != productId;
      }
    );
    products.clear();
    products.addAll(filtered.values());
  };

  // Public read access - anyone including guests can view products
  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  // Public read access - anyone including guests can filter by category
  public query func getProductsByCategory(category : Text) : async [Product] {
    products.values().filter(
      func(p) {
        p.category == category;
      }
    ).toArray();
  };

  // Public read access - anyone including guests can view featured products
  public query func getFeaturedProducts() : async [Product] {
    products.values().filter(
      func(p) { p.featured }
    ).toArray();
  };

  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };

    let existingCart = carts.filter(
      func((user, _)) {
        user == caller;
      }
    );
    let newCart = { items = [item]; createdAt = Time.now() };
    existingCart.add((caller, newCart));
    carts.addAll(existingCart.values());
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };

    let filteredCarts = carts.filter(
      func((user, _)) {
        user != caller;
      }
    );
    carts.clear();
    carts.addAll(filteredCarts.values());
  };

  public query ({ caller }) func getCart() : async ?Cart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    let filtered = carts.filter(
      func((user, _)) {
        user == caller;
      }
    );
    let cartList = filtered.values().toArray();
    if (cartList.size() == 0) {
      null;
    } else {
      ?cartList[0].1;
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };

    let filtered = carts.filter(
      func((user, _)) {
        user != caller;
      }
    );
    carts.clear();
    carts.addAll(filtered.values());
  };

  // QUIZ / PERSONALIZATION

  public shared ({ caller }) func submitQuiz(answers : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit quiz");
    };

    let recommendedCategories = if (answers.size() > 0) {
      [answers[0]];
    } else { [] };

    let submission : QuizSubmission = {
      userId = caller;
      answers;
      recommendedCategories;
      timestamp = Time.now();
    };

    quizSubmissions.add(submission);
  };

  public query ({ caller }) func getMyRecommendations() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view recommendations");
    };

    let filtered = quizSubmissions.filter(
      func(q) {
        q.userId == caller;
      }
    );
    let submissions = filtered.toArray();
    if (submissions.size() == 0) {
      [];
    } else {
      products.values().filter(
        func(p) {
          submissions[0].recommendedCategories.find(
            func(category) { category == p.category }
          ) != null;
        }
      ).toArray();
    };
  };

  // STYLE SURVEY

  public shared ({ caller }) func submitStyleSurvey(
    figure : Text,
    proportions : Text,
    skinTone : Text,
    eyeColor : Text,
    hairColor : Text,
    hairTexture : Text,
    stylePreference : Text,
    colorPalette : Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit style survey");
    };
    let survey : StyleSurvey = {
      userId = caller;
      figure;
      proportions;
      skinTone;
      eyeColor;
      hairColor;
      hairTexture;
      stylePreference;
      colorPalette;
      timestamp = Time.now();
    };
    styleSurveys.add(caller, survey);
  };

  public query ({ caller }) func getMyStyleSurvey() : async ?StyleSurvey {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their style survey");
    };
    styleSurveys.get(caller);
  };

  public query ({ caller }) func getStats() : async EcommerceStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view stats");
    };

    let featuredProducts = products.values().filter(
      func(p) { p.featured }
    ).toArray();

    {
      totalProducts = products.size();
      totalOrders = 0;
      featuredProducts = featuredProducts.size();
    };
  };

  // Seed data
  system func preupgrade() { () };

  system func postupgrade() { () };
};
