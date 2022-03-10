<?php

require_once('PhpSIP.class.php');

// Docs:
// https://github.com/level7systems/php-sip

try
{
    $api = new PhpSIP();
    $api->setDebug(true);
    $api->setProxy('192.168.0.1');
    $api->setServerMode(true);
    $api->setUsername('guest');
    $api->setPassword('guest');
    $api->listen(['MESSAGE']);
    echo "MESSAGE received\n";

    $res = $api->reply(200,'OK');
    echo 'Result: ';
    var_dump($res);
} catch (Exception $e) {
    echo 'Exception: ';
    var_dump($e);
}
