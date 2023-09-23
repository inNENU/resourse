<?php

/**
 * Page Handler
 *
 * PHP version 8
 *
 * @category  weather
 * @package   weather
 * @author    Mr.Hope <zhangbowang1998@gmail.com>
 * @copyright 2018-2021 Mr.Hope
 * @license   No License
 * @link      https://mister-hope.com.com
 */

declare(strict_types=1);
require_once 'header/post-json.php';
require_once 'lib/curl.php';

/**
 * 获得天气代码
 * 
 * @param $icon 天气代码
 * @param $isDay 当前是否是白天
 */
function getWeatherCode(string $icon, bool $isDay)
{
  return (
    ($icon === "00" || $icon === "01" || $icon === "03" || $icon === "13"
      ? ($isDay ? "day/" : "night/")
      : "") . $icon);
};

/**
 * 对字符串键值进行排序
 */
function sortKey(string $a, string $b)
{
  return intval($a) - intval($b);
};

// 获得天气
$weather = curlGet("https://wis.qq.com/weather/common?source=xw&weather_type=observe|rise|air|forecast_1h|forecast_24h|index|alarm|limit|tips&province=吉林&city=长春&county=南关");

// 获得天气数据
$weatherData = json_decode($weather, true)["data"];

// 生成日出日落时间
$riseTime = array();
uksort($weatherData["rise"], "sortKey");
foreach ($weatherData["rise"] as $index => $value) {
  if (!empty($value["sunrise"]) && !empty($value["sunset"]))
    array_push($riseTime, $value["sunrise"], $value["sunset"]);
}
unset($weatherData["rise"]);

// 移除已经过期的日出日落时间
$isDay = false;
$setTime = "23:59";
while (
  intval(substr($weatherData["forecast_1h"][0]["update_time"], 8, 2)) >
  intval(substr($riseTime[0], 0, 2))
) {
  $isDay = !$isDay;
  if (!$isDay) {
    $setTime = array_shift($riseTime);
    break;
  } else array_shift($riseTime);
}

// 处理小时预报
$weatherData["hourForecast"] = array();
uksort($weatherData["forecast_1h"], "sortKey");
foreach ($weatherData["forecast_1h"] as $index => $value) {
  if ($value["update_time"]) {
    // 白天
    if ($isDay) {
      // 到了日落时间
      if (
        intval(substr($weatherData["forecast_1h"][$index]["update_time"], 8, 2)) >
        intval(substr($riseTime[0], 0, 2))
      ) {
        array_push($weatherData["hourForecast"], array(
          "weatherCode" => "set",
          "degree" => "日落",
          "time" => $riseTime[0]
        ));
        $setTime = array_shift($riseTime);
        $isDay = false;
      }
    }
    // 夜晚且到了日出时间 
    else if (
      intval(substr($weatherData["forecast_1h"][$index]["update_time"], 8, 2)) >
      intval(substr($riseTime[0], 0, 2))
      &&
      intval(substr($weatherData["forecast_1h"][$index]["update_time"], 8, 2)) <
      intval(substr($setTime, 0, 2))
    ) {
      array_push($weatherData["hourForecast"], array(
        "weatherCode" => "rise",
        "degree" => "日出",
        "time" => $riseTime[0]
      ));
      array_shift($riseTime);
      $isDay = true;
    }

    array_push($weatherData["hourForecast"], array(
      "weatherCode" => getWeatherCode($value["weather_code"], $isDay),
      "degree" => $value["degree"] . "°",
      "time" => substr($value["update_time"], 8, 2) . ":" .
        substr($value["update_time"], 10, 2)
    ));
  }
}

unset($weatherData["forecast_1h"]);

// 处理天预报
$weatherData["dayForecast"] = array();
uksort($weatherData["forecast_24h"], "sortKey");
foreach ($weatherData["forecast_24h"] as $index => $value) {
  array_push($weatherData["dayForecast"], array(
    "weekday" => $index === 0
      ? "昨天"
      : ($index === 1
        ? "今天"
        : ($index === 2
          ? "明天"
          : ($index === 3
            ? "后天"
            : '星期' . array(
              "天",
              "一",
              "二",
              "三",
              "四",
              "五",
              "六",
            )[(date("w") + $index - 1) % 7]))),
    "dayWeather" => $value["day_weather"],
    "dayWeatherShort" => $value["day_weather_short"],
    "dayWeatherCode" => getWeatherCode($value["day_weather_code"], true),
    "nightWeather" => $value["night_weather"],
    "nightWeatherCode" => getWeatherCode($value["night_weather_code"], false),
    "nightWeatherShort" => $value["night_weather_short"],
    "nightWindPower" => $value["night_wind_power"],
    "nightWindDirection" => $value["night_wind_direction"],
    "maxDegree" => $value["max_degree"],
    "minDegree" => $value["min_degree"],
    "date" => substr($value["time"], 5, 2) . "/" . substr($value["time"], 8, 2)
  ));
}
unset($weatherData["forecast_24h"]);

// 处理空气质量
$weatherData["air"] = array(
  "aqi" => $weatherData["air"]["aqi"],
  "aqiLevel" => $weatherData["air"]["aqi_level"],
  "aqiName" => $weatherData["air"]["aqi_name"],
);

// 处理实时天气
$weatherData["observe"]["weatherCode"] = $weatherData["observe"]["weather_code"];
unset($weatherData["observe"]["weather_code"]);
$windDirection = $weatherData["observe"]["wind_direction"];
$weatherData["observe"]["windDirection"] =
  $windDirection === "8"
  ? "北"
  : ($windDirection === "1"
    ? "东北"
    : ($windDirection === "2"
      ? "东"
      : ($windDirection === "3"
        ? "东南"
        : ($windDirection === "4"
          ? "南"
          : ($windDirection === "5"
            ? "西南"
            : ($windDirection === "6"
              ? "西"
              : ($windDirection === "7"
                ? "西北"
                : "未知")))))));
unset($weatherData["observe"]["wind_direction"]);
$weatherData["observe"]["windPower"] = $weatherData["observe"]["wind_power"];
unset($weatherData["observe"]["wind_power"]);

// 处理贴士
unset($weatherData["index"]["time"]);
$weatherData["hints"] = array();
foreach ($weatherData["index"] as $key => $value) {
  array_push($weatherData["hints"], array(
    "id" => $key,
    "name" => $value["name"],
    "info" => $value["info"],
    "detail" => $value["detail"],
  ));
}
array_push($weatherData["hints"], array(
  "id" => "tailnumber",
  "name" => "尾号限行",
  "info" => $weatherData["limit"]["tail_number"],
  "detail" => "今日尾号限行情况: 限行" . $weatherData["limit"]["tail_number"] . "尾号"
));
unset($weatherData["limit"]);
unset($weatherData["index"]);

// 处理提示
$weatherData["tips"] = $weatherData["tips"]["observe"];
unset($weatherData["tips"]["observe"]);

echo (json_encode($weatherData, 320));
