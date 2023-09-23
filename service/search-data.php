<?php

/**
 * Search Data Handler
 *
 * PHP version 8
 *
 * @category  Search
 * @package   Search
 * @author    Mr.Hope <zhangbowang1998@gmail.com>
 * @copyright 2021 Mr.Hope
 * @license   No License
 * @link      https://mister-hope.com
 */

declare(strict_types=1);

require_once 'header/post-json.php';
require_once 'lib/list-files.php';

enum SearchItemType: int
{
  case Page = 0;
  case ID = 1;
}

enum SearchIndexType: int
{
  case Title = 1;
  case Heading = 2;
  case Text = 3;
  case Image = 4;
  case Card = 5;
  case Doc = 6;
}



function create_search_map(string $folder): array
{
  $searchMap = [];

  $files = list_files($folder);

  foreach ($files as $file) {
    if (str_ends_with($file, '.json')) {

      $fileContent = file_get_contents($file);

      $content = json_decode($fileContent, true);

      $id = preg_replace(
        '/\.\/(.*)\.json/',
        '$1',
        $file,
      );

      $pageIndex = [
        SearchItemType::ID,
        $content['title'],
        []
      ];


      foreach ($content['content'] as $component) {
        if ($component['tag'] === 'title') {
          array_push($pageIndex[2], [SearchIndexType::Title, $component['text']]);
        } else if ($component['tag'] === 'text' || $component['tag'] === 'ul' || $component['tag'] === 'ol' || $component['tag'] === 'p') {
          if (isset($component['heading']) && is_string($component['heading'])) {
            array_push($pageIndex[2], [SearchIndexType::Heading, $component['heading']]);
          }
          if (isset($component['text'])) {
            foreach ($component['text'] as $text) {
              array_push($pageIndex[2], [SearchIndexType::Text, $text]);
            }
          }
        } else if ($component['tag'] === 'image') {
          if (isset($component['desc'])) {
            array_push($pageIndex[2], [SearchIndexType::Image, [
              'desc' => $component['desc'],
              'icon' => preg_match($component['src'], '/\.jpe?g$/') ? 'jpg' : (preg_match($component['src'], '/\.png$/') ? 'png' : 'document')
            ]]);
          }
        } else if ($component['tag'] === 'list') {
          if (isset($component['header']) && is_string($component['header'])) {
            array_push($pageIndex[2], [SearchIndexType::Heading, $component['header']]);
          }

          foreach ($component['items'] as $listItem) {
            array_push($pageIndex[2], [SearchIndexType::Text, $listItem['text']]);
          }
        } else if ($component['tag'] === 'card') {
          array_push($pageIndex[2], [SearchIndexType::Card, [
            'title' => $component['title'],
            'desc' => isset($component['desc']) ? $component['desc'] : ''
          ]]);
        } else if ($component['tag'] === 'doc') {
          array_push($pageIndex[2], [SearchIndexType::Doc, [
            'name' => $component['name'],
            'icon' => $component['icon']
          ]]);
        } else if ($component['tag'] === 'table') {
          if (isset($component['caption'])) {
            array_push($pageIndex[2], [SearchIndexType::Heading, $component['caption']]);
          }

          array_push($pageIndex[2], [SearchIndexType::Heading, join(' | ', $component['header'])]);


          foreach ($component['body'] as $row) {
            array_push($pageIndex[2], [SearchIndexType::Text, join(' | ', $row)]);
          }
        } else if ($component['tag'] === 'account') {
          array_push($pageIndex[2], [SearchIndexType::Heading, $component['name']]);
          if (isset($component['detail'])) {
            array_push($pageIndex[2], [SearchIndexType::Text, $component['detail']]);
          }
          if (isset($component['desc'])) {
            array_push($pageIndex[2], [SearchIndexType::Text, $component['desc']]);
          }
        } else if ($component['tag'] === 'phone') {
          if (isset($component['header']) && is_string($component['header'])) {
            array_push($pageIndex[2], [SearchIndexType::Heading, $component['header']]);
          }

          array_push($pageIndex[2], [SearchIndexType::Text, (isset($component['lName']) ? $component['lName'] : '') .  $component['fName'] . ': ' . ($component['num'])]);
        }
      }

      $searchMap[$id] = $pageIndex;
    }
  }

  return $searchMap;
}

function create_search_data(string $file): array
{
  $fileContent = file_get_contents($file);

  $content = json_decode($fileContent, true);
  $functionSearchMap = [];

  foreach ($content as $item) {
    if (isset($item['tags'])) {
      $functionSearchMap[$item['url']] = [
        SearchItemType::Page,
        $item['text'],
        $item['icon'],
        $item['tags'],
      ];
    } else {
      $functionSearchMap[$item['url']] = [
        SearchItemType::Page,
        $item['text'],
        $item['icon'],
      ];
    }
  }

  return $functionSearchMap;
}


if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
  chdir("../d/");

  $data = json_decode(file_get_contents('php://input'));

  $type = isset($data->type) ? $data->type : 'all';

  if ($type === 'all') {
    $searchIndex = array_merge(
      create_search_map('./guide'),
      create_search_map('./intro'),
      create_search_map('./newcomer'),
      create_search_map('./school'),
      create_search_map('./apartment'),
      create_search_data('./search/function.json'),
    );
  } else if ($type === 'guide') {
    $searchIndex
      = array_merge(
        create_search_map('./guide'),
        create_search_map('./newcomer'),
      );
  } else if ($type === 'intro') {
    $searchIndex
      = array_merge(
        create_search_map('./intro'),
        create_search_map('./school'),
        create_search_map('./apartment')
      );
  } else if ($type === 'function') {
    $searchIndex = create_search_data('./search/function.json');
  }

  echo (json_encode($searchIndex, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}
