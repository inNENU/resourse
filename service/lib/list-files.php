<?php
function list_files(string $dir): array
{
  $results = [];

  if (!is_dir($dir)) return $results;

  $files = scandir($dir);
  foreach ($files as $file) {
    if ($file == '.' || $file == '..') continue;
    if (is_dir($dir . '/' . $file)) {
      array_push($results, ...list_files($dir . '/' . $file));
    } else {
      array_push($results, $dir . '/' . $file);
    }
  }

  return $results;
}
