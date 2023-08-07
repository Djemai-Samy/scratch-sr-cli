<?php

namespace App\Controller;

use Scratch\Core\Controller;
use Scratch\Core\HTTP\Response;
use Scratch\Core\Route;

class YourController extends Controller{

  function __construct() {
  }

  #[Route('/ping', ['GET'])]
  function index() {
    //return new Response('Hello from you controller');
    return $this->json(['message'=>'hello world']);
  }
}
