<?php

require_once('PhpSIP.class.php');

// Docs:
// https://github.com/level7systems/php-sip

try
{
    $api = new PhpSIP();
    $api->setDebug(true);
    $api->setProxy('192.168.0.1');
    $api->setUsername('guest');
    $api->setPassword('guest');
    $api->setMethod('MESSAGE');
    $api->setFrom('sip:guest@192.168.0.1');
    $api->setUri('sip:guest@192.168.0.1');
    $api->setBody('Hello world');

    $res = $api->send();
    echo 'Result: ';
    var_dump($res);
} catch (Exception $e) {
    echo 'Exception: ';
    var_dump($e);
}
