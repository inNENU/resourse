<?php

/**
 * Page Handler
 *
 * PHP version 8
 *
 * @category  version
 * @package   version
 * @author    Mr.Hope <zhangbowang1998@gmail.com>
 * @copyright 2018-2021 Mr.Hope
 * @license   No License
 * @link      https://mister-hope.com
 */

declare(strict_types=1);

require_once 'header/post-json.php';

chdir("../d/");

$handle = @fopen("version.json", "r");
if ($handle) {
  $contents = fread($handle, filesize("version.json"));
  fclose($handle);
  echo $contents;
} else {
  echo 'error';
}
