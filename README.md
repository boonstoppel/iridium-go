## Send instant message with SIP Client


Step 1:

Run the incoming message listener

```
php php/listen.php
```



Step 2:

Send an test message 

```
php php/message.php
```



Iridium Go! device sends back the following error message:

> --> MESSAGE sip:guest@192.168.0.1 SIP/2.0
> 
> <-- SIP/2.0 401 Unauthorized
> 
> --> MESSAGE sip:guest@192.168.0.1 SIP/2.0
> 
> <-- SIP/2.0 481 Call Does Not Exist
> 
> Result: string(3) "481"
