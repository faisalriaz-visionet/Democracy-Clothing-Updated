jQuery(document).ready(function() {
  jQuery("body").on("click", ".close-thank-you", function(){
    jQuery(".swell-post-checkout-democracy-clothing").remove();
  });
  if(window.location.href.indexOf("/refer") > -1 || window.location.href.indexOf("/rewards") > -1 || window.location.href.indexOf("/account?view=my-rewards") > -1) {
    jQuery('body').addClass("page-swell-rewards");
  }

  jQuery(document).on("swell:initialized", function() {
    jQuery('.swell-initialized-loader').remove();
    SwellConfig.Redemption.initializeRedemptions(".swell-redemption-option-list");
    SwellConfig.Redemption.initializeProductRedemptions(".swell-product-list");
  });

  jQuery(document).on("swell:setup", function() {
    jQuery('.swell-referral-loader').remove();
    jQuery(".swell-post-checkout-democracy-clothing").css("display","flex");
    Swell.Campaign.initializeCampaigns(".swell-campaign-list", SwellConfig.Campaign.opts);
    SwellConfig.Referral.initializeReferral(".swell-referral");
    SwellConfig.Tier.initializeCustomTierProperties();
    SwellConfig.Tier.initializeTiers(".swell-tier-list");
    SwellConfig.Tier.setupStatus('.swell-tier-list');
    swellAPI.refreshEmbeds();
  });

  jQuery(document).on("swell:referral:error", function(jqXHR, textStatus, errorThrown) {
    var emails = jQuery("#swell-referral-refer-emails").val();
    jQuery(".refer-customer-error").remove();
    if (emails.indexOf(spapi.customer.email) > -1 ) {
      jQuery("<p class=\"refer-customer-error\">Email address is already associated with an account.</p>").insertBefore(jQuery("#swell-referral-refer-emails").parent().parent());;
      jQuery("#swell-referral-refer-emails").addClass("error-border");
    }else if(textStatus && textStatus === "Please enter a valid email address"){
      jQuery('<p class=\"refer-customer-error\">Please enter a valid email addresses.</p>').insertBefore(jQuery("#swell-referral-refer-emails").parent().parent());
      jQuery("#swell-referral-refer-emails").parent().parent().addClass("error-border");
    } else if(textStatus && textStatus === "EMAILS_ALREADY_PURCHASED"){
      jQuery('<p class=\"refer-customer-error\">Oops, looks like we already know that person. Try another friend\'s email address!</p>').insertBefore(jQuery("#swell-referral-refer-emails").parent().parent());
      jQuery("#swell-referral-refer-emails").parent().parent().addClass("error-border");
    }
  });

  jQuery(document).on("swell:referral:success", function(jqXHR, textStatus, errorThrown) {
    SwellConfig.Referral.populateReferral();
  });

});

(function() {
  window.SwellConfig = window.SwellConfig || {};
  SwellConfig.Campaign = {
    opts: {
      templates: {
        campaign: '<li class="swell-campaign"> <div class="swell-campaign-content" data-display-mode="modal" data-campaign-id="<%= campaign.id %>"> <div class="swell-campaign-icon-holder"><i class="swell-icon <%= campaign.icon %>"></i></div> <div class="swell-campaign-details-holder"> <div class="swell-campaign-value"> <span class="campaign-text"><%= campaign.reward_text %></span> </div> <div class="swell-campaign-type"> <span class="campaign-title"><%= campaign.title %></span> </div> </div> </div> </li>',
      }
    }
  };
}).call(this);

(function() {
   window.SwellConfig = window.SwellConfig || {};

   SwellConfig.Referral = {
      opts: {
         localization: {
          referralSidebarDetailsAction: "",
          referralSidebarDetailsReward: "",

          referralRegisterHeading: "<span class='refer-heading'>Share the love</span><span class='refer-heading swell-checkout'>Thank you for your order!</span>Give $20,<br class='swell-mobile'/> Get $20",
          referralRegisterDetails: "Give your friends $20 off their first order of $100+ and receive a $20 credit for each successful referral.",
          referralRegisterFormDetails: "Submit your email to get started.",
          referralRegisterFormEmail: "Your email...",
          referralRegisterFormSubmit: "next",

          referralReferHeading: "<span class='refer-heading'>Share the love</span><span class='refer-heading swell-checkout'>Thank you for your order!</span>Give $20,<br class='swell-mobile'/> Get $20",
          referralReferDetails: "Give your friends $20 off their first order of $100+ and receive a $20 credit for each successful referral.",
          referralReferFormSubmit: "send",
          referralReferFormDetails: "Enter your friends' emails.",
          referralReferFormEmailsDetails: "Your friends' emails (separated by commas)",

          referralShareFacebook: "Share",
          referralShareMessenger: "Message",
          referralShareTwitter: "Tweet",
          referralShareSMS: "Sms",
          referralShareCopy: "Copy Link",

          referralFacebookIcon: "swell-icon-facebook-share-mob",
          referralMessengerIcon: "swell-icon-fb-message-mob",
          referralTwitterIcon: "swell-icon-tweet-mob",
          referralSMSIcon: "swell-icon-sms-mob",
          referralLinkIcon: "swell-icon-copy-link-mob",

          referralThanksHeading: "Thanks for Referring!",
          referralThanksDetails: "Remind your friends to check their emails.",

          referralCopyHeading: "",
          referralCopyButton: "Copy link",
          referralCopyDetails: "Copy link and share with your friends."
        },
        templates: {
          referralCopy: '<div class="swell-referral-copy"> <div class="swell-referral-copy-content"> <div class="swell-referral-copy-sidebar"></div> <div class="swell-referral-copy-main"> <span class="swell-referral-back-link"></span> <h2 class="swell-referral-heading"> <i class="swell-referral-heading-icon <%= localization.referralLinkIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralCopyHeading %> </h2> <div class="swell-referral-form-wrapper"> <div class="swell-referral-copy-link" id="swell-referral-copy-link"><%= customer.referralLink %>?c</div> <button class="swell-referral-copy-button" id="swell-referral-copy-button" data-clipboard-target="#swell-referral-copy-link"><%= localization.referralCopyButton %></button> <p class="swell-referral-details"><%= localization.referralCopyDetails %></p> </div> </div> </div> <div>',
          referralRefer: '<div class="swell-referral-refer"> <h2 class="swell-referral-heading"><%= localization.referralReferHeading %></h2> <p class="swell-referral-details"><%= localization.referralReferDetails %></p> <div class="swell-referral-form-wrapper"> <form class="swell-referral-form" name="swell-referral-refer-form" id="swell-referral-refer-form" method="POST" action="."> <div class="swell-referral-form-header"><p class="swell-referral-form-header-details"><%= localization.referralReferFormDetails %></p></div> <div class="swell-referral-form-body"> <ul class="swell-referral-form-list"> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-field-input" type="text" name="swell-referral-refer-emails" id="swell-referral-refer-emails" required="required" placeholder="<%= localization.referralReferFormEmailsDetails %>" /> <input class="swell-referral-form-list-submit" type="submit" name="swell-referral-refer-submit" id="swell-referral-refer-submit" value="<%= localization.referralReferFormSubmit %>" /> </li> </ul> </div> </form> </div> <div class="swell-referral-media-wrapper"> <ul class="swell-referral-media-list"> <li class="swell-referral-medium swell-share-referral-facebook"> <div class="swell-referral-medium-content"><i class="swell-referral-media-icon <%= localization.referralFacebookIcon %>" aria-hidden="true"></i> <%= localization.referralShareFacebook %></div> </li> <li class="swell-referral-medium swell-share-referral-sms"> <div class="swell-referral-medium-content"><i class="swell-referral-media-icon <%= localization.referralSMSIcon %>" aria-hidden="true"></i> <%= localization.referralShareSMS %></div> </li> <li class="swell-referral-medium swell-share-referral-messenger"> <div class="swell-referral-medium-content"><i class="swell-referral-media-icon <%= localization.referralMessengerIcon %>" aria-hidden="true"></i> <%= localization.referralShareMessenger %></div> </li> <li class="swell-referral-medium swell-share-referral-twitter"> <div class="swell-referral-medium-content"><i class="swell-referral-media-icon <%= localization.referralTwitterIcon %>" aria-hidden="true"></i> <%= localization.referralShareTwitter %></div> </li> <li class="swell-referral-medium swell-checkout swell-share-referral-copy"> <div class="swell-referral-medium-content"><i class="swell-referral-media-icon <%= localization.referralLinkIcon %>" aria-hidden="true"></i> <%= localization.referralShareCopy %></div> </li> </ul> </div> </div><script type="text/javascript">SwellConfig.Referral.initializeCopyLink("#swell-referral-link-container");</script>',
          referralRegister: '<div class="swell-referral-register"> <h2 class="swell-referral-heading"><%= localization.referralRegisterHeading %></h2> <p class="swell-referral-details"><%= localization.referralRegisterDetails %></p> <div class="swell-referral-form-wrapper"> <form name="swell-referral-register-form" id="swell-referral-register-form" method="POST" action="."> <div class="swell-referral-form-header"> <p class="swell-referral-form-header-details"><%= localization.referralRegisterFormDetails %></p> </div> <div class="swell-referral-form-body"> <ul class="swell-referral-form-list"> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-field-input" type="email" name="swell-referral-register-email" id="swell-referral-register-email" required="required" placeholder="<%= localization.referralRegisterFormEmail %>"> <input class="swell-referral-form-list-submit" type="submit" name="swell-referral-register-submit" id="swell-referral-register-submit" value="<%= localization.referralRegisterFormSubmit %>"> </li> </ul> </div> </form> </div> </div>'
        }
      
      },
      initializeReferral: function(containerSelector) {
        var email = jQuery(containerSelector).data("customer-email");
        if (email) {
          spapi.storage.setItem("referrer_email", email);
          spapi.customer.email = email;
        }
        Swell.Referral.initializeReferral(".swell-referral", SwellConfig.Referral.opts);
        SwellConfig.Referral.populateReferral();
      },
      populateReferral: function(){
        if (spapi.customer.email) {
            swellAPI.refreshCustomerDetails(function () {
                var referral_receipts = spapi.customer.referral_receipts;
                jQuery(".table-data tr").remove();
                referral_receipts.forEach(function (referral_receipt) {
                    var email = referral_receipt.email;
                    var completed_at = referral_receipt.completed_at;
                    if (completed_at) {
                        status = "Completed";
                    } else {
                        status = "Pending";
                    }
                    jQuery(".table-data").append("<tr class='"+ (completed_at?"swell-completed":"swell-pending") +"'><td>" + email + "</td><td>" + status + "</td></tr>");
                });
            });
        }
      },
      initializeCopyLink: function(containerSelector){
        if(jQuery(containerSelector).length > 0 && jQuery(containerSelector).find(".swell-referral-copy-link-1").length < 1 ){
          referralCode = "http://rwrd.io/"+spapi.customer.referral_code+"?c";
          document.getElementById("swell-referral-link-container").style.backgroundColor = "rgba(0,0,0,0.3)";
          jQuery(containerSelector).html('<ul class="swell-referral-copy-form"> <li class="swell-referral-copy-text"> <p>Here\'s your <br>referral link</p> </li> <li class="swell-referral-copy-holder"> <p> <span class="swell-referral-copy-link-1" id="swell-referral-copy-link-1">'+referralCode+'</span> </p> </li> <li class="swell-referral-copy-button-holder"> <button type="button" class="swell-referral-copy-button-1" id="swell-referral-copy-button" data-clipboard-target="#swell-referral-copy-link-1">Copy link</button> </li> </ul>');
          var clipboard = new ClipboardJS("#swell-referral-copy-button");
          clipboard.on("success", function (element) {
            /* Select the text field */
            if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
             jQuery('.swell-referral-copy-link-1').css('background-color','#77a5de');
             jQuery('.swell-referral-copy-link-1').css('color','#fff');
             setTimeout(function(){
               jQuery('.swell-referral-copy-link-1').css('background-color','transparent');
               jQuery('.swell-referral-copy-link-1').css('color','#787878');
             }, 3000);
            }
          });
        }
      }
   };

}).call(this);


// Tier_List Start
(function() {
  window.SwellConfig = window.SwellConfig || {};
  SwellConfig.Tier = {
    sortTiers:function(tiers){
      if(tiers[0].rank!= 0){
        while(tiers[0].rank!= 0){
          temp = tiers.pop();
          tiers.unshift(temp);
        }
      }
    },
    getCustomerTierRank: function() {
      var customer_tier, intro_tier, rank, tiers;
      customer_tier = spapi.customer.vip_tier;
      tiers = spapi.activeVipTiers;
      if (customer_tier && customer_tier.id) {
        rank = jQuery.grep(tiers, function(e) {
          return e.id === customer_tier.id;
        })[0].rank;
        return rank;
      } else {
        intro_tier = jQuery.grep(tiers, function(e) {
          return e.swellrequiredAmountSpent === "$0" && e.swellrequiredAmountSpentCents === 0 && e.swellrequiredPointsEarned === 0 && e.swellrequiredPurchasesMade === 0 && e.swellrequiredReferralsCompleted === 0;
        });
        if (intro_tier.length > 0) {
          return intro_tier[0].rank;
        } else {
          return null;
        }
      }
    },
    getCustomerTierId: function () {
      var customer_tier, intro_tier, tiers;
      customer_tier = spapi.customer.vip_tier;
      tiers = spapi.activeVipTiers;
      if (customer_tier) {
        return customer_tier.id;
      } else {
        intro_tier = jQuery.grep(tiers, function (e) {
          return e.swellrequiredAmountSpent === "$0" && e.swellrequiredAmountSpentCents === 0 && e.swellrequiredPointsEarned === 0 && e.swellrequiredPurchasesMade === 0 && e.swellrequiredReferralsCompleted === 0;
        });
        if (intro_tier.length > 0) {
          return intro_tier[0].id;
        } else {
          return null;
        }
      }
    },
    getTierById : function(id) {
      var tiers;
      tiers = spapi.activeVipTiers;
      return jQuery.grep(tiers, function(e) {
        return e.id === id;
      })[0];
    },
    getTierByRank: function(rank) {
      var tiers;
      tiers = spapi.activeVipTiers;
      return jQuery.grep(tiers, function(e) {
        return e.rank === rank;
      })[0];
    },
    initializeCustomTierProperties: function() {
      var tiers = spapi.activeVipTiers;
        Tier_0 = SwellConfig.Tier.getTierByRank(0);
        Tier_1 = SwellConfig.Tier.getTierByRank(1);
        Tier_2 = SwellConfig.Tier.getTierByRank(2);

      if(Tier_0){
        if(Tier_1){
          Tier_0.spend = "Entry conditions: $"+(Tier_0.amount_spent_cents/100)+" - $"+((Tier_1.amount_spent_cents/100)-1)+"<br>(Spent per rolling year)"; 
        }else{
          Tier_0.spend = "Entry conditions: $"+(Tier_0.amount_spent_cents/100)+"+<br>(Spent per rolling year)"; 
        }
        Tier_0.point_multiplier = "<li><span class='swell-details'>- 1X points per $1 spent</span></li>"; 
        Tier_0.free_shipping = "<li><span class='swell-details'>- Free Standard Shipping</span></li>"; 
        Tier_0.early_access = '<li><span class="swell-details">- Early access to sales</span></li>';  
        Tier_0.exclusive_access = '<li class="swell-desktop"><span class="swell-details"></span></li>';  
        Tier_0.merchandise = '<li class="swell-desktop"><span class="swell-details"></span></li>';  
        Tier_0.free_tote = '<li class="swell-desktop"><span class="swell-details"></span></li>';  
        Tier_0.feedback = '<li class="swell-desktop"><span class="swell-details"></span></li>';  
        Tier_0.tier_icon = 'swell-icon-embrace';
        Tier_0.class = 'tier_0'; 
      }
      if(Tier_1){
        if(Tier_2){
          Tier_1.spend = "Entry conditions: $"+(Tier_1.amount_spent_cents/100)+" - $"+((Tier_2.amount_spent_cents/100)-1)+"<br>(Spent per rolling year)"; 
        }else{
          Tier_1.spend = "Entry conditions: $"+(Tier_1.amount_spent_cents/100)+"+<br>(Spent per rolling year)"; 
        }
        Tier_1.point_multiplier = "<li><span class='swell-details'>- 1.25X points per $1 spent"; 
        Tier_1.free_shipping = "<li><span class='swell-details'>- Free Standard Shipping"; 
        Tier_1.early_access = '<li><span class="swell-details">- Early access to sales</span></li>';  
        Tier_1.exclusive_access = '<li><span class="swell-details">- Exclusive Offers</span></li>';   
        Tier_1.merchandise = '<li class="swell-desktop"><span class="swell-details"></span></li>';  
        Tier_1.free_tote = '<li class="swell-desktop"><span class="swell-details"></span></li>';  
        Tier_1.feedback = '<li class="swell-desktop"><span class="swell-details"></span></li>'; 
        Tier_1.tier_icon = 'swell-icon-enhance';
        Tier_1.class = 'tier_1'; 
      }
      if(Tier_2){
        Tier_2.spend = "Entry conditions: $"+(Tier_2.amount_spent_cents/100)+"+<br>(Spent per rolling year)"; 
        Tier_2.point_multiplier = "<li><span class='swell-details'>- 1.5X points per $1 spent</span></li>"; 
        Tier_2.free_shipping = "<li><span class='swell-details'>- Free Standard Shipping</span></li>"; 
        Tier_2.early_access = '<li><span class="swell-details">- Early access to sales</span></li>';  
        Tier_2.exclusive_access = '<li><span class="swell-details">- Exclusive Offers</span></li>';  
        Tier_2.merchandise = '<li><span class="swell-details">- Merchandise Giveaway</span></li>';  
        Tier_2.free_tote = '<li><span class="swell-details">- Free tote with order</span></li>';  
        Tier_2.feedback = '<li><span class="swell-details">- Product feedback group</span></li>'; 
        Tier_2.tier_icon = 'swell-icon-elevate';
        Tier_2.class = 'tier_2'; 
      }
    },
    initializeTiers: function(containerSelector) {
      var tiers;
      if (jQuery(containerSelector).length === 0) {
        return "";
      }
      tiers = spapi.activeVipTiers;
      SwellConfig.Tier.sortTiers(tiers);
      tiers.forEach(function(tier) {
        return jQuery(containerSelector).append('<li class="list-items '+ tier.class +' tier-list-item" data-tier-id="'+tier.id+'"> <div class="content-holder"> <div class="items-holder"> <div class="items-heading-holder"> <div class="swell-header-details">'+ tier.name +'</div> <div class="swell-details">'+ tier.spend +'</div> </div> <div class="tier-icon-holder"><i class="tier-icon '+tier.tier_icon+'" /></div> <ul class="point-holder">'+ tier.point_multiplier + tier.free_shipping + tier.early_access + tier.exclusive_access + tier.merchandise + tier.free_tote + tier.feedback +' </ul> </div> </div> </li>');
      });
      SwellConfig.Tier.applytierSlickSlider('.swell-tier-list');
      jQuery(".swell-tier-list").on('beforeChange', function(event, slick, currentSlide, nextSlide){
        var NextSlideDom=jQuery(slick.$slides.get(nextSlide));
        if(jQuery(NextSlideDom).find(".swell-active").length > 0){
          jQuery(".swell-tier-list .slick-arrow").addClass("swell-active");
        }else{
          jQuery(".swell-tier-list .slick-arrow").removeClass("swell-active");
        }
      });
    },
    setupStatus: function(containerSelector){
      if(spapi.authenticated){
        var toGoNext, next_tier;
        var last_tier = spapi.activeVipTiers.length;
        var last_tier_rank = SwellConfig.Tier.getTierByRank(last_tier - 1);
        if (spapi.customer.vip_tier) {
          var $customer_tier_id, $customer_tier_rank;
          customer_tier_id = SwellConfig.Tier.getCustomerTierId();
          customer_tier_rank = SwellConfig.Tier.getCustomerTierRank();

          tiers = spapi.activeVipTiers;
          tiers.forEach(function (tier) {
            if (tier.id == customer_tier_id) {
              customer_tier = tier;
            }
          });
          if (last_tier_rank.rank == customer_tier_rank) {
            tiers.forEach(function (tier) {
              if (tier.rank == customer_tier.rank) {
                jQuery(".tier-list-item[data-tier-id='" + tier.id + "']").prepend("<span class='current_status'>Current Status</span>");
                jQuery(".tier-list-item[data-tier-id='" + tier.id + "']").addClass("swell-active");
              }
            });
          } else {
            next_tier = SwellConfig.Tier.getTierByRank(customer_tier_rank + 1);
            toGoNext = (next_tier.amount_spent_cents - spapi.customer.vip_tier_stats.amount_spent_cents) / 100;
            if(toGoNext < 0)
            {
              toGoNext = 0;
            }
            tiers.forEach(function (tier) {
              if (tier.rank == customer_tier.rank) {
                jQuery(".tier-list-item[data-tier-id='" + tier.id + "']").prepend("<span class='current_status'>Current Status</span>");
                jQuery(".tier-list-item[data-tier-id='" + tier.id + "'] .current_status").append("<span class='spend_more'>Spend $" + toGoNext + " more to earn "+next_tier.name+" tier</span>");
                jQuery(".tier-list-item[data-tier-id='" + tier.id + "']").addClass("swell-active");
              }
            });
          }
        } 
        else {
          next_tier = SwellConfig.Tier.getTierByRank(0);
          toGoNext = (next_tier.amount_spent_cents - spapi.customer.vip_tier_stats.amount_spent_cents) / 100;
          if(toGoNext < 0)
          {
            toGoNext = 0;
          }
          jQuery(".tier-list-item[data-tier-id='"+ next_tier.id +"']").prepend("<span class='current_status'></span>");
          jQuery(".tier-list-item[data-tier-id='"+ next_tier.id +"'] .current_status").append("<span class='spend_more'>Spend $" + toGoNext + " more to earn "+next_tier.name+" tier</span>");
        }
      }
    },
    applytierSlickSlider: function(containerSelector){
      jQuery(containerSelector).slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToScroll:1,
        slidesToShow: 3,
        adaptiveHeight:false,
        responsive: [
        {
          breakpoint: 768,
          settings: {
            dots: true,
            adaptiveHeight:true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            prevArrow: '<i class="swell-icon-left-arrow swell-prev"></i>',
            nextArrow: '<i class="swell-icon-right-arrow swell-next"></i>',
          }
        }
        ]
      });
    }
  };

}).call(this);
// Tier_List End

(function() {
  window.SwellConfig = window.SwellConfig || {};

  SwellConfig.Redemption = {
    initializeProductRedemptions: function(conntainerSelector){
      var activator = "";
      if (jQuery(conntainerSelector).hasClass("logged-in")) {
        activator = "swell-buy-product-btn";
      }
      spapi.activeRedemptionOptions.forEach(function(redemption){
        if(redemption.discount_type === "product"){
          if(spapi.customer.adjusted_points_balance < redemption.amount){
            activator = "";
          }
          jQuery(conntainerSelector).append('<li class="swell-redemption-product"> <div class="swell-redemption-product-content" data-redemption-option-id="'+ redemption.id +'"> <div class="product-img-holder"> <img src="'+ redemption.background_image_url +'"> </div> <div class="swell-redemption-option-value">'+ redemption.name +' </div> <div class="swell-redemption-option-cost">'+ redemption.cost_text +'</div> <div class="swell-redemption-product-btn '+activator+'" data-variant-id="'+ redemption.applies_to_id +'" data-redemption-option-id="'+ redemption.id +'" data-confirm-title="Are you sure?" data-confirm-content="You currently have *|point_balance|* points available. This product costs *|amount|* points to redeem." data-confirm-btn-text="Yes, buy it" data-error-type="red" data-error-title="Whoops!" data-error-content="Looks like you don\'t have enough points for this product. This product costs *|amount|* points and you only have *|point_balance|* points available." data-error-okay-text="Ok" data-success-type="green" data-success-title="Success!" data-success-content="Product was successfully added to your cart" data-success-ok-btn="Keep Shopping" data-success-cart-btn="View Cart" data-success-cart-link="/cart">Redeem Now</div> </div> </li>');
        }
      });
      SwellConfig.Redemption.applySlickSlider(conntainerSelector);
    },
    initializeRedemptions: function(conntainerSelector){
      var activator = "";
      if (jQuery(conntainerSelector).hasClass("logged-in")) {
        activator = "";
      }
      spapi.activeRedemptionOptions.forEach(function(redemption){
        if(redemption.discount_type === "fixed_amount"){
          jQuery(conntainerSelector).append('<li class="swell-redemption-option"> <div class="'+activator+' swell-redemption-option-content" data-redemption-option-id="'+ redemption.id +'"> <div class="swell-redemption-option-cost">'+redemption.name+'</div> <div class="swell-redemption-option-value">'+redemption.cost_text+'</div> </div> </li>');
        }
      });
    },
    applySlickSlider : function(containerSelector){
      jQuery(containerSelector).slick({
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: false,
        arrows: false,
        responsive: [
          {
            breakpoint: 980,
            settings: {
              centerMode: false,
              slidesToShow: 3,
              slidesToScroll: 1,
            }
          },
          {
            breakpoint: 768,
            settings: {
              centerMode: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              centerPadding: '90px',
            }
          },
          {
            breakpoint: 480,
            settings: {
              centerMode: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              centerPadding: '50px',
            }
          },
          {
            breakpoint: 370,
            settings: {
              centerMode: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              centerPadding: '20px',
            }
          }
       ]
      });
    }
  };

}).call(this);

window.onBeforeProductRedemption = function(opts, redemptionOption, pointBalance, cb) {
  var redeemedItemsInCart = 0;
  var regularItemsInCart = 0;
  var discountInCart = 0;
    
  if(Swell.Cart && Swell.Cart.items) {
    var cart = Swell.Cart;
    
    jQuery.each(cart.items, function(index, item){
      if(item.properties._swell_points_used){
        redeemedItemsInCart++;
      } else if(item.line_price > 0){
        regularItemsInCart++;
      }
    });
    
    if(regularItemsInCart == 0){
      spapi.$.confirm({
        title: "Oops!",
        content: "You must add a priced item in your cart to redeem points for a free product.",
        type: "red",
        typeAnimated: true,
        useBootstrap: false,
        boxWidth: "400px",
        buttons: {
          ok: {
            text: "Ok",
            action: function () {
            }
          }
        }
      });
    } else {
      cb();   
    }
  }
};
