package com.OMEL.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import com.OMEL.model.SMS;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class SMSService {
    public static final String ACCOUNT_SID = "AC90a3a4ba97ac4395a3ed679e7140143f";
    public static final String AUTH_TOKEN = "e2c20c2ac22f87dc246fcf70628f71e3";
    public static final String FROM_NUMBER = "+12516640639";

    public void send(SMS sms) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Message message = Message.creator(new PhoneNumber(sms.getTo()), new PhoneNumber(FROM_NUMBER), sms.getMessage())
                .create();
    }

    public void receive(MultiValueMap<String, String> smscallback) {
    }
}
