
export class Selectors {
  static AppWindow = '#app-content .app'

  static WelcomePage = '.welcome-page__wrapper'
  static WelcomePageButton = `${this.WelcomePage} button`

  static FirstTimeFlowButton = '.first-time-flow__button'
  static FirstTimeFlowCheckBox = '.first-time-flow__checkbox-container .first-time-flow__checkbox'
  static FirstTimeFlowCheckBoxTerms = '.first-time-flow__checkbox-container .first-time-flow__terms'

  static PrimaryButton = '.btn-primary'

  static UnlockPage = '.unlock-page'
  static UnlockPageContainer = `${this.UnlockPage}__container`
  static UnlockPageForm = '.unlock-page__form'
  static UnlockPageFormButton = `${this.UnlockPageForm} .MuiButton-containedSizeLarge`
  static UnlockPageLinks = `${this.UnlockPage} .unlock-page__links`
  static UnlockPageLinksButton = `${this.UnlockPageLinks} button`

  static Password = '.MuiInputBase-root #password'
  static ConfirmPassword = '.MuiInputBase-root #confirm-password'

  static FormInput = '.MuiInput-formControl input'
  static FormPassword = '.MuiInputBase-root #password'

  static Spinner = '.lds-spinner'

  static PopoverHeaderButton = '.popover-header__button'

  static NotificationAcceptNextButton = '.notification .permissions-connect-choose-account__bottom-buttons button:nth-child(2)'
  static NotificationAcceptConnectButton = '.permissions-connect .permission-approval-container__footers button:nth-child(2)'

  static HomeContainer = '.home__container'

  static AccountPortraitIcon = '.app-header .identicon__address-wrapper'
  static AccountLockButton = '.account-menu__lock-button'

  static NetworkDisplay = '.app-header__account-menu-container .network-display'
}
