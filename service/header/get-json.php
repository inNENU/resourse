<?php

/**
 * Request Header for posts that return json
 *
 * PHP version 8
 *
 * @category  header
 * @package   header/post-json
 * @author    Mr.Hope <zhangbowang1998@gmail.com>
 * @copyright 2021 Mr.Hope
 * @license   No License
 * @link      https://mister-hope.com
 */

header("Content-Type: text/json; charset=utf-8");
header('Access-Control-Allow-Methods:GET');
header('Access-Control-Allow-Headers:x-requested-with,content-type');
