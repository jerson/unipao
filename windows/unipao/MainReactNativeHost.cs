using ReactNative;
using ReactNative.Modules.Core;
using ReactNative.Shell;
using System.Collections.Generic;
using RNDeviceInfo;
using CodePush.ReactNative;
using Cl.Json.RNShare;
using Microsoft.AppCenter;
using Microsoft.AppCenter.Analytics;
using Microsoft.AppCenter.Push;
using Microsoft.AppCenter.Crashes;
using RNFS;

namespace unipao
{
    class MainReactNativeHost : ReactNativeHost
    {
        public MainReactNativeHost() {
            AppCenter.Start("f47b1ffa-5600-4e57-9536-6cf81c85af23", typeof(Push), typeof(Analytics), typeof(Crashes));
        }
        private CodePushReactPackage codePushReactPackage;

        public override string MainComponentName => "unipao";

#if !BUNDLE || DEBUG
        public override bool UseDeveloperSupport => true;
#else
        public override bool UseDeveloperSupport => false;
#endif

        protected override string JavaScriptMainModuleName => "index";

#if BUNDLE && !BETA
        protected override string JavaScriptBundleFile
        {
            get
            {
                codePushReactPackage = new CodePushReactPackage("soO1fdzkHEZip9_URGHP2IvwJVCgrJ9Elopzz", this);
                return codePushReactPackage.GetJavaScriptBundleFile();
            }
        }
#endif
#if BUNDLE && BETA
        protected override string JavaScriptBundleFile
        {
            get
            {
                codePushReactPackage = new CodePushReactPackage("Dlh6vjlsq-c6LLqWwosvYvukmRg2r15FOMg4G", this);
                return codePushReactPackage.GetJavaScriptBundleFile();
            }
        }
#endif

        protected override List<IReactPackage> Packages => new List<IReactPackage>
        {
            new MainReactPackage(),
            new RNDeviceInfoPackage(),
            new RNSharePackage(),
            new RNFSPackage(),
            codePushReactPackage
        };
    }
}
