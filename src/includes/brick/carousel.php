<?php
/**
 * @package Abricos
 * @subpackage Carousel
 * @author Alexander Kuzmin <roosit@abricos.org>
 */

$brick = Brick::$builder->brick;
$v = &$brick->param->var;
$p = &$brick->param->param;

/** @var CarouselManager $modManager */
$modManager = Abricos::GetModule('carousel')->GetManager();
$app = $modManager->GetApp();

$carouselid = $p['carouselid'];
$name = $p['name'];

$carousel = null;
if ($carouselid > 0){
    $carousel = $app->Carousel($carouselid);
} else if (!empty($name)){
    $carousel = $app->CarouselByName($name);
}

if (empty($carousel) || ($carousel->off && empty($p['ignoreoff']))){
    $brick->content = "";
    return;
}

$slideList = $app->SlideList($carousel->id);
$lstIndicator = "";
$lstItem = "";
for ($i = 0; $i < $slideList->Count(); $i++){
    $slide = $slideList->GetByIndex($i);

    $lstIndicator .= Brick::ReplaceVarByData($v['indicator'], array(
        "index" => $i,
        "active" => $i === 0 ? "active" : ""
    ));

    $slideItemTemplate = $carousel->isCustomTemplate ? $carousel->customTemplate : $v['slidebody'];

    $slideBody = Brick::ReplaceVarByData($slideItemTemplate, array(
        "code" => $slide->code,
        "filehash" => $slide->filehash,
        "title" => $slide->title,
        "url" => empty($slide->url) ? "#" : $slide->url,
        "imgwidth" => empty($carousel->width) ? "auto" : $carousel->width."px",
        "imgheight" => empty($carousel->height) ? "auto" : $carousel->height."px"
    ));

    $lstItem .= Brick::ReplaceVarByData($v['slide'], array(
        "active" => $i === 0 ? "active" : "",
        "body" => $slideBody
    ));
}


$brick->content = Brick::ReplaceVarByData($brick->content, array(
    "indicators" => $lstIndicator,
    "items" => $lstItem,
    "brickid" => $brick->id
));


if (empty($p['nowrap'])){
    $brick->content = Brick::ReplaceVarByData($v["wrap"], array(
        "content" => $brick->content
    ));
}
