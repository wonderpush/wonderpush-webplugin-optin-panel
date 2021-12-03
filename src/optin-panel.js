/**
 * WonderPush Web SDK plugin to present the user an opt-in dialog before prompting her for push permission.
 * @class OptinDialog
 * @param {external:WonderPushPluginSDK} WonderPushSDK - The WonderPush SDK instance provided automatically on intanciation.
 * @param {OptinDialog.Options} options - The plugin options.
 */
/**
 * @typedef {Object} OptinDialog.Options
 * @property {external:WonderPushPluginSDK.TriggersConfig} [triggers] - The triggers configuration for this plugin.
 * @property {string} [title] - The dialog title.
 * @property {string} [message] - The dialog message.
 * @property {string} [positiveButton] - The dialog positive button message.
 * @property {string} [negativeButton] - The dialog negative button message.
 * @property {string} [lockedNotificationTitle] - The lockedNotificationDialog upper text message.
 * @property {string} [lockedNotificationSubtitle] - The lockedNotificationDialog lower text message.
 * @property {string} [lockedNotificationTitleTextColor] - The lockedNotificationDialog upper text message.
 * @property {string} [lockedNotificationSubtitleTextColor] - The lockedNotificationDialog lower text message.
 * @property {string} [lockedNotificationTitleFontSize] - The lockedNotificationDialog upper text message.
 * @property {string} [lockedNotificationSubtitleFontSize] - The lockedNotificationDialog lower text message.
 * @property {string} [lockedNotificationImg] - The lockedNotificationDialog img.
 * @property {string} [notificationText] - The dialog show notification message.
 * @property {string} [icon] - The dialog icon URL. Defaults to the default notification icon configured in the project.
 * @property {Object} [style] - Styles to be added to the dialog container.
 * @property {number|boolean} [closeSnooze=false] - How long to force to wait before presenting the dialog again, if the user clicks the close button.
 *                                                  Use `false` to not set any extra snooze, `true` to never present again, or give a duration in milliseconds.
 *                                                  Defaults to `false`, which relies on the SDK's default snooze of 12 hours without forcing extra snooze.
 * @property {number|boolean} [negativeSnooze=604800000] - How long to force to wait before presenting the dialog again, if the user clicks the close button.
 *                                                     Use `false` to ignore, `true` to never present again, or give a duration in milliseconds.
 *                                                     Defaults to 604800, 7 days.
 * @property {string} [positiveButtonBackgroundColor] - The hex color code of the positive button.
 * @property {string} [negativeButtonBackgroundColor] - The hex color code of the negative button.
 * @property {string} [positiveButtonTextColor] - The hex color code of the positive button.
 * @property {string} [negativeButtonTextColor] - The hex color code of the negative button.
 * @property {string} [backgroundColor] - The hex color code of the dialog background.
 * @property {string} [textColor] - The hex color code of the dialog text.
 */
/**
 * The WonderPush JavaScript SDK instance.
 * @external WonderPushPluginSDK
 * @see {@link https://wonderpush.github.io/wonderpush-javascript-sdk/latest/WonderPushPluginSDK.html|WonderPush JavaScript Plugin SDK reference}
 */
/**
 * WonderPush SDK triggers configuration.
 * @typedef TriggersConfig
 * @memberof external:WonderPushPluginSDK
 * @see {@link https://wonderpush.github.io/wonderpush-javascript-sdk/latest/WonderPushPluginSDK.html#.TriggersConfig|WonderPush JavaScript Plugin SDK triggers configuration reference}
 */
 WonderPush.registerPlugin("optin-panel", function (WonderPushSDK, options) {
  // Do not show anything on unsupported browsers.
  if (!WonderPushSDK.isNativePushNotificationSupported()) {
    return {
      showDialog: function () {},
      showDialogAndroid: function () {},
      hideDialog: function () {},
    };
  }

  var translations = {
    fr: {
      "Would you like to subscribe to push notifications?":
        "Souhaitez-vous vous inscrire aux notifications?",
      "You can always unsubscribe at any time.":
        "Vous pouvez vous désinscrire à tout moment.",
      Subscribe: "Je m'inscris",
      Later: "Plus tard",
      "Show notifications": "Afficher les notifications",
      "Web push by WonderPush": "Push web par WonderPush",
    },
    es: {
      "Would you like to subscribe to push notifications?":
        "¿Desea suscribirse a las notificaciones push?",
      "You can always unsubscribe at any time.":
        "Siempre puede darse de baja en cualquier momento",
      Subscribe: "Me suscribo",
      Later: "Más tarde",
      "Show notifications": "Mostrar notificaciones",
      "Web push by WonderPush": "Push web por WonderPush",
    },
    it: {
      "Would you like to subscribe to push notifications?":
        "Vuoi iscriverti alle notifiche push?",
      "You can always unsubscribe at any time.":
        "Puoi annullare l'iscrizione in qualsiasi momento",
      Subscribe: "Mi iscrivo",
      Later: "Più tardi",
      "Show notifications": "Mostra notifiche",
      "Web push by WonderPush": "Push web di WonderPush",
    },
    de: {
      "Would you like to subscribe to push notifications?":
        "Möchten Sie Push-Benachrichtigungen abonnieren?",
      "You can always unsubscribe at any time.":
        "Sie können sich jederzeit abmelden.",
      Subscribe: "Register",
      Later: "Später",
      "Show notifications": "Zeige Benachrichtigungen",
      "Web push by WonderPush": "Web push von WonderPush",
    },
    pt: {
      "Would you like to subscribe to push notifications?":
        "Deseja se inscrever para receber notificações?",
      "You can always unsubscribe at any time.":
        "Você pode cancelar a qualquer momento.",
      Subscribe: "Register",
      Later: "Mais tarde",
      "Show notifications": "Mostrar notificações",
      "Web push by WonderPush": "Push web da WonderPush",
    },
    nl: {
      "Would you like to subscribe to push notifications?":
        "Wilt u zich abonneren op pushmeldingen?",
      "You can always unsubscribe at any time.":
        "U kunt zich altijd op elk gewenst moment afmelden.",
      Subscribe: "Abonneren",
      Later: "Later",
      "Show notifications": "Meldingen weergevens",
    },
    pl: {
      "Would you like to subscribe to push notifications?":
        "Czy chcesz subskrybować powiadomienia push?",
      "You can always unsubscribe at any time.":
        "Zawsze możesz zrezygnować z subskrypcji w dowolnym momencie.",
      Subscribe: "Subskrybuj",
      Later: "Później",
      "Show notifications": "Pokaż powiadomienia",
    },
  };
  var locales = WonderPushSDK.getLocales ? WonderPushSDK.getLocales() || [] : [];
  var language =
    // locales.map(function (x) {
    //   return x.split(/[-_]/)[0];
    // })[0] || 
    (navigator.language || "").split("-")[0];

  /**
   * Translates the given text
   * @param text
   * @returns {*}
   */
  var _ = function (text) {
    if (translations.hasOwnProperty(language) && translations[language][text])
      return translations[language][text];
    return text;
  };

  var _title = options.title !== undefined ? options.title : _("Would you like to subscribe to push notifications?");
  var _message = options.message !== undefined ? options.message : _("You can always unsubscribe at any time.");
  var _positiveButton = options.positiveButton || _("Subscribe");
  var _negativeButton = options.negativeButton || _("Later");
  var _notificationText = options.notificationText || _("Show notifications");

  var _lockedNotificationTitle = options.lockedNotificationTitle || _("Your notifications are blocked?");
  var _lockedNotificationSubtitle =  options.lockedNotificationSubtitle || _("From your navigation bar click on:");
  var _lockedNotificationImg = options.lockedNotificationImg !== undefined ? options.lockedNotificationImg : "https://www.wonderpush.loc/dist/barNavigationChrome.png";

  var _style = options.style;
  var _icon = options.icon !== undefined ? options.icon : WonderPushSDK.getNotificationIcon();
  var _hidePoweredBy = !!options.hidePoweredBy;
  var _closeSnooze =
    options.closeSnooze !== undefined ? options.closeSnooze : false;
  var _negativeSnooze =
    options.negativeSnooze !== undefined ? options.negativeSnooze : 604800000;

  var _triggers = options.triggers;

  WonderPushSDK.loadStylesheet("style.css");

  var _registrationInProgress = false;

  var _hideDialogEventSource;
  var _hideDialog;

  
  if (WonderPushSDK.waitTriggers) {
    // WonderPush SDK 1.1.18.0 or above
    WonderPushSDK.waitTriggers(_triggers).then(
      function () {
        this.showDialog();
      }.bind(this)
    );
  } else {
    WonderPushSDK.checkTriggers(
      _triggers,
      function () {
        this.showDialog();
      }.bind(this)
    );
  }

  /**
   * Hides the dialog.
   * @function
   * @memberof! OptinDialog.prototype
   * @fires OptinDialog#event:"wonderpush-webplugin-optin-panel.hide"
   */
  this.hideDialog = function () {
    if (_hideDialog) {
      /**
       * Hide event.
       *
       * This event bubbles and is cancelable.
       * @event OptinDialog#event:"wonderpush-webplugin-optin-panel.hide"
       */
      if (
        _hideDialogEventSource.dispatchEvent(
          new Event("wonderpush-webplugin-optin-panel.hide", {
            bubbles: true,
            cancelable: true,
          })
        )
      ) {
        _hideDialog();
        _registrationInProgress = false;
        _hideDialog = undefined;
        _hideDialogEventSource = undefined;
      }
    }
  }.bind(this);

  /**
   * Shows the dialog.
   * @function
   * @memberof! OptinDialog.prototype
   * @fires OptinDialog#event:"wonderpush-webplugin-optin-panel.show"
   */
  this.showDialog = function () {
    var that = this;
    var userAgent = navigator.userAgent;
    var browserName;
    console.log(userAgent);
        if (userAgent.match(/edg/i)) {
          console.log("edge");
          browserName = "edge";
        } else if (userAgent.match(/chrome|chromium|crios/i)) {
          console.log("chrome");
          browserName = "chrome";
        } else if (userAgent.match(/firefox|fxios/i)) {
          console.log("firefox");
          browserName = "firefox";
        } else if (userAgent.match(/safari/i)) {
          console.log("safari");
          browserName = "safari";
        } else if (userAgent.match(/opr\//i)) {
          console.log("opera");
          browserName = "opera";
        } else {
          console.log("No browser detection");
          browserName = "No browser detection";
        }
    
    if (_registrationInProgress) {
      WonderPushSDK.logDebug("Registration already in progress");
      return;
    }

    _registrationInProgress = true;
    var cssPrefix = "wp-optin-panel-";

    var boxDiv = document.createElement("div");
    boxDiv.className = cssPrefix + "container" + " wp-optin-panel-container_" + browserName;
    if (options.backgroundColor) {
      boxDiv.style.backgroundColor = options.backgroundColor;
      boxDiv.style.backgroundImage = "none";
      boxDiv.style.borderColor = options.backgroundColor;
    }
    boxDiv.style.color = options.textColor || "black";
    if (_style) {
      for (var key in _style) {
        boxDiv.style[key] = _style[key];
      }
    }

    _hideDialog = function () {
      // Note: boxDiv could have been moved out of BODY under another node
      //       hence use boxDiv.parentNode instead of document.body.
      boxDiv.parentNode.removeChild(boxDiv);
    };
    _hideDialogEventSource = boxDiv;

    var fakeDiv = document.createElement("div");
    fakeDiv.className = cssPrefix + "fakeContainer";
    var fakeNativeModal = document.createElement("div");
    fakeNativeModal.className = cssPrefix + "fakeContainer-fakeNativeModal";
    var fakeText1 = document.createElement("span");
    fakeText1.className = cssPrefix + "fakeContainer-fakeNativeModal-text1";
    fakeText1.textContent = "www.wonderpush.loc souhaite";
    var fakeText2 = document.createElement("span");
    fakeText2.className = cssPrefix + "fakeContainer-fakeNativeModal-text2";
    fakeText2.textContent = _notificationText;
    var fakeText2Img = document.createElement("img");
    fakeText2Img.src = "https://www.wonderpush.loc/dist/bell.svg";
    fakeText2.appendChild(fakeText2Img);

    var fakeHardButtons = document.createElement("div");
    fakeHardButtons.className = cssPrefix + "fakeContainer-fakeNativeModal-hardButtons";





    fakeNativeModal.appendChild(fakeText1);
    fakeNativeModal.appendChild(fakeText2);
    fakeNativeModal.appendChild(fakeHardButtons);
    
    fakeDiv.appendChild(fakeNativeModal);
    boxDiv.appendChild(fakeDiv);
    
    var bodyDiv = document.createElement("div");
    bodyDiv.className = cssPrefix + "body";
    boxDiv.appendChild(bodyDiv);


    var lockedNotificationsContainer = document.createElement("div");
    var lockedNotificationsContainerLeft = document.createElement("div");
    var lockedNotificationsContainerRight = document.createElement("div");
    var lockedNotificationsTextArrow = document.createElement("div");

    var lockedNotificationsTextUpper = document.createElement("div");
    var lockedNotificationsTextLower = document.createElement("div");
    var lockedNotificationsImg = document.createElement("img");
    if(browserName === "firefox") {
      lockedNotificationsContainer.className = cssPrefix + "lockedContainer " + cssPrefix + "lockedContainer-chrome";
      lockedNotificationsImg.src = _lockedNotificationImg;
    } else if(browserName === "edge"){
      lockedNotificationsContainer.className = cssPrefix + "lockedContainer " + cssPrefix + "lockedContainer-chrome";
      lockedNotificationsImg.src = _lockedNotificationImg;
    } else {
      lockedNotificationsContainer.className = cssPrefix + "lockedContainer " + cssPrefix + "lockedContainer-chrome";
      lockedNotificationsImg.src = _lockedNotificationImg;
    }
   

    var closeButtonLocked = document.createElement("a");
    closeButtonLocked.href = "#";
    closeButtonLocked.className = cssPrefix + "lockedContainer-close";
    closeButtonLocked.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.parentElement.style.display = "none";
    });
    
    lockedNotificationsTextUpper.className = cssPrefix + "lockedContainer-textUpper";
    lockedNotificationsTextLower.className = cssPrefix + "lockedContainer-textLower";
    lockedNotificationsImg.className = cssPrefix + "lockedContainer-img";
    lockedNotificationsTextUpper.style.color = options.lockedNotificationTitleTextColor || "black";
    lockedNotificationsTextUpper.style.fontSize = options.lockedNotificationTitleFontSize || "14px";
    lockedNotificationsTextLower.style.color = options.lockedNotificationSubtitleTextColor || "black";
    lockedNotificationsTextLower.style.fontSize = options.lockedNotificationSubtitleFontSize || "14px";

    lockedNotificationsTextUpper.textContent = _lockedNotificationTitle;
    
    lockedNotificationsTextLower.textContent = _lockedNotificationSubtitle;

    lockedNotificationsContainerLeft.appendChild(closeButtonLocked);
    lockedNotificationsContainerLeft.appendChild(lockedNotificationsTextUpper);
    lockedNotificationsContainerLeft.appendChild(lockedNotificationsTextLower);
    lockedNotificationsContainerLeft.appendChild(lockedNotificationsImg);
    lockedNotificationsContainerRight.appendChild(lockedNotificationsTextArrow);
    lockedNotificationsContainerRight.className = cssPrefix + "lockedContainer-right";
    lockedNotificationsContainerLeft.className = cssPrefix + "lockedContainer-left";
    lockedNotificationsTextArrow.className = cssPrefix + "lockedContainer-right-arrow";


    lockedNotificationsContainer.appendChild(lockedNotificationsContainerLeft);
    lockedNotificationsContainer.appendChild(lockedNotificationsContainerRight);

    
    document.body.appendChild(lockedNotificationsContainer);






    if (_icon) {
      var iconDiv = document.createElement("img");
      iconDiv.className = cssPrefix + "icon";
      iconDiv.src =
        _icon.replace("(", "%28").replace(")", "%29");
      bodyDiv.appendChild(iconDiv);
    }

    var textDiv = document.createElement("div");
    textDiv.className = cssPrefix + "text";
    bodyDiv.appendChild(textDiv);
    if (_title) {
      var titleDiv = document.createElement("div");
      titleDiv.className = cssPrefix + "title";
      titleDiv.innerHTML = _title;
      textDiv.appendChild(titleDiv);
    }
    if (_message) {
      var messageDiv = document.createElement("div");
      messageDiv.className = cssPrefix + "message";
      messageDiv.innerHTML = _message;
      textDiv.appendChild(messageDiv);
    }
    if (!_hidePoweredBy) {
      var poweredByLink = document.createElement("a");
      poweredByLink.innerHTML = _("Web push by WonderPush");
      poweredByLink.href =
        "https://docs.wonderpush.com/docs/manage-your-data-and-unsubscribe-from-web-push-notifications";
      poweredByLink.className = cssPrefix + "powered-by";
      poweredByLink.setAttribute("title", "Web and mobile push notifications");
      textDiv.appendChild(poweredByLink);
    }
   
    var btnConfig = {
      positiveButton: {
        label: _positiveButton,
        backgroundColor: options.positiveButtonBackgroundColor || undefined,
        color: options.positiveButtonTextColor || undefined,
        click: function (event) {
          /**
           * Positive button click event.
           *
           * This event bubbles and is cancelable.
           * @event OptinDialog#event:"wonderpush-webplugin-optin-panel.positiveButton.click"
           */

          var modalNotificationsLocked = document.querySelector(".wp-optin-panel-lockedContainer");
          modalNotificationsLocked.style.display = "flex";
          if (
            event.target.dispatchEvent(
              new Event(
                "wonderpush-webplugin-optin-panel.positiveButton.click",
                { bubbles: true, cancelable: true }
              )
            )
          ) {
            WonderPushSDK.subscribeToNotifications(event);
            that.hideDialog();
          }
        },
      },
      negativeButton: {
        label: _negativeButton,
        backgroundColor: options.negativeButtonBackgroundColor || undefined,
        color: options.negativeButtonTextColor || undefined,
        click: function (event) {
          if (
            _negativeSnooze !== undefined &&
            _negativeSnooze !== false &&
            WonderPushSDK.snoozeTriggers
          )
            WonderPushSDK.snoozeTriggers(_negativeSnooze);
          /**
           * Negative button click event.
           *
           * This event bubbles and is cancelable.
           * @event OptinDialog#event:"wonderpush-webplugin-optin-panel.negativeButton.click"
           */
          if (
            event.target.dispatchEvent(
              new Event(
                "wonderpush-webplugin-optin-panel.negativeButton.click",
                { bubbles: true, cancelable: true }
              )
            )
          ) {
            that.hideDialog();
          }
        },
      },
    };

    var btns = ["negativeButton", "positiveButton"];
    btns.forEach(function (btn) {
      var fakeHardButton = document.createElement("div");
      fakeHardButton.className = cssPrefix + "fakeContainer-fakeNativeModal-" + btn;

      if (btnConfig[btn].backgroundColor) {
        fakeHardButton.style.backgroundColor = btnConfig[btn].backgroundColor;
        fakeHardButton.style.backgroundImage = "none";
        fakeHardButton.style.borderColor = btnConfig[btn].backgroundColor;
      }
      if (btnConfig[btn].color) {
        fakeHardButton.style.color = btnConfig[btn].color;
      }
      fakeHardButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        btnConfig[btn].click(event);
      });
      fakeHardButtons.appendChild(fakeHardButton);
      fakeHardButton.innerHTML = btnConfig[btn].label;
    });

    var closeButton = document.createElement("a");
    boxDiv.appendChild(closeButton);
    closeButton.href = "#";
    closeButton.className = cssPrefix + "close";
    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (
        _closeSnooze !== undefined &&
        _closeSnooze !== false &&
        WonderPushSDK.snoozeTriggers
      )
        WonderPushSDK.snoozeTriggers(_closeSnooze);
      /**
       * Close button click event.
       *
       * This event bubbles and is cancelable.
       * @event OptinDialog#event:"wonderpush-webplugin-optin-panel.closeButton.click"
       */
      if (
        event.target.dispatchEvent(
          new Event("wonderpush-webplugin-optin-panel.closeButton.click", {
            bubbles: true,
            cancelable: true,
          })
        )
      ) {
        that.hideDialog();
      }
    });

    /**
     * Show event.
     *
     * This event bubbles and is cancelable.
     * @event OptinDialog#event:"wonderpush-webplugin-optin-panel.show"
     */
    if (
      document.body.dispatchEvent(
        new Event("wonderpush-webplugin-optin-panel.show", {
          bubbles: true,
          cancelable: true,
        })
      )
    ) {
      document.body.appendChild(boxDiv);
    } else {
      _registrationInProgress = false;
      _hideDialog = undefined;
      _hideDialogEventSource = undefined;
    }
  }.bind(this);
  this.showDialogAndroid = function () {
    var cssPrefixAndroid = "wp-optin-panel-android";
    var boxDivAndroid = document.createElement("div");
    var divText = document.createElement("div");
    var title = document.createElement("div");
    var text1 = document.createElement("div");
    var text2 = document.createElement("div");
    var divImg = document.createElement("div");


    var closeButton = document.createElement("a");
    closeButton.href = "#";
    closeButton.className = cssPrefixAndroid + "-container-close";
    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.parentElement.style.display = "none";
    });

    var divTextBottom = document.createElement("div");
    var divTextBottomDescription = document.createElement("div");
    var divTextBottomArrow = document.createElement("div");

    divTextBottom.className =  cssPrefixAndroid + "-container-bottom";
    divTextBottomDescription.className =  cssPrefixAndroid + "-container-bottom-text";
    divTextBottomArrow.className = cssPrefixAndroid + "-container-bottom-arrow";

    divTextBottomDescription.textContent = 'Cliquer sur pour autoriser';

    divTextBottom.appendChild(divTextBottomDescription);
    divTextBottom.appendChild(divTextBottomArrow);
    

    boxDivAndroid.className = cssPrefixAndroid + "-container";
    divText.className = cssPrefixAndroid + "-container-divText";
    title.className = cssPrefixAndroid + "-container-divText-title";
    text1.className = cssPrefixAndroid + "-container-divText-text1";
    text2.className = cssPrefixAndroid + "-container-divText-text2";
    divImg.className = cssPrefixAndroid + "-container-divImg";

    divText.appendChild(title);
    divText.appendChild(text1);
    divText.appendChild(text2);

    title.textContent = 'Soyez notifié de nos meilleures idées de séjours en avant première !';
    text1.textContent = 'Aucun email requis.';
    text2.textContent = 'Autoriser les notifications pour en profiter.';
    // if(_icon){
    //   divImg.style.backgroundImage = _icon;
    // }
    divImg.style.backgroundImage = "url('https://images.unsplash.com/photo-1638518652297-97b36bd7e0fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')";
    
    boxDivAndroid.appendChild(divText);
    boxDivAndroid.appendChild(divImg);
    boxDivAndroid.appendChild(divTextBottom);

    document.body.appendChild(boxDivAndroid);
  }.bind(this);
});
