package com.example.exampleapp.config;

public class CognitoConfig {

    private String userpoolid;
    private String clientid;
    private String region;
    private String jwksUrl;

    public String getUserpoolid() {
        return userpoolid;
    }

    public void setUserpoolid(String userpoolid) {
        this.userpoolid = userpoolid;
    }

    public String getClientid() {
        return clientid;
    }

    public void setClientid(String clientid) {
        this.clientid = clientid;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getJwksUrl() {
        return jwksUrl;
    }

    public void setJwksUrl(String jwksUrl) {
        this.jwksUrl = jwksUrl;
    }
}
