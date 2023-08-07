<?php
require_once(__DIR__ . "/../vendor/autoload.php");

use Scratch\Core\Kernel\App;

putenv('APP_MODE=development');
$app = new App();

$app->handle();
