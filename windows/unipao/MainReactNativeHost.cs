using ReactNative;
using ReactNative.Modules.Core;
using ReactNative.Shell;
using System.Collections.Generic;
using RNDeviceInfo;
using CodePush.ReactNative;

namespace unipao
{
    class MainReactNativeHost : ReactNativeHost
    {
        private CodePushReactPackage codePushReactPackage;

        public override string MainComponentName => "unipao";

#if !BUNDLE || DEBUG
        public override bool UseDeveloperSupport => true;
#else
        public override bool UseDeveloperSupport => false;
#endif

        protected override string JavaScriptMainModuleName => "index";

#if BUNDLE
        protected override string JavaScriptBundleFile
        {
            get
            {
                codePushReactPackage = new CodePushReactPackage("soO1fdzkHEZip9_URGHP2IvwJVCgrJ9Elopzz", this);
                return codePushReactPackage.GetJavaScriptBundleFile();
            }
        }
#endif

        protected override List<IReactPackage> Packages => new List<IReactPackage>
        {
            new MainReactPackage(),
            new RNDeviceInfoPackage(),
            codePushReactPackage
        };
    }
}
