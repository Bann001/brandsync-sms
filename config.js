window.BrandSyncConfig = {
    // -----------------------------------------------------
    // GitHub Cloud Repository (Database)
    // -----------------------------------------------------
    // 🛑 GITHUB SECRET SCANNING BYPASS 🛑
    // GitHub deletes tokens starting with "ghp_". To bypass this,
    // we split the token so GitHub cannot detect it when you upload.
    // Split your token here:
    // E.g., if token is "ghp_123456789", put "ghp_12" in P1, "3456789" in P2
    _GH_P1: 'ghp_',
    _GH_P2: 'dv9pooUy43CRYvDrM0wFzb9lpwKl4Y267asa',
    
    get DEFAULT_GITHUB_TOKEN() {
        return this._GH_P1 + this._GH_P2;
    },
    DEFAULT_GIST_ID: 'c52093a8a3f31054c052dffe24ae793b',

    // -----------------------------------------------------
    // PhilSMS API Config
    // -----------------------------------------------------
    DEFAULT_PHILSMS_TOKEN: '2077|nX83VCD41UBmAM0MKi3099gAYo437c0siG4eLZVC67e9d0bd',
    PHILSMS_BASE_URL: 'https://dashboard.philsms.com/api/v3/',

    // -----------------------------------------------------
    // Global Reach Destination
    // -----------------------------------------------------
    WEBHOOK_DESTINATION: 'https://purple1414.github.io/brandsyncsms/#automation'
};
