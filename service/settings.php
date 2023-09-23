<?php

/**
 * Page Handler
 *
 * PHP version 8
 *
 * @category  Page
 * @package   Page
 * @author    Mr.Hope <zhangbowang1998@gmail.com>
 * @copyright 2021 Mr.Hope
 * @license   No License
 * @link      https://mister-hope.com
 */

declare(strict_types=1);

require_once 'header/post-json.php';

chdir("../d/config/");

$data = json_decode(file_get_contents('php://input'));

$appID = $data->appID;
$version = $data->version;
$filename = $appID . "/" . $version . "/settings.json";

$handle = @fopen($filename, "r");
if ($handle) {
  $contents = fread($handle, filesize($filename));
  fclose($handle);
  echo $contents;
} else {
  echo 'error';
}
