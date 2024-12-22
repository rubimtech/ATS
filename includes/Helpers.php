<?php

defined('ABSPATH') or exit;

class Helpers 
{
    static function view($__view = null, $__data = [])
    {
        static $__gatherData = [];

        array_push($__gatherData, $__data);
        //ob_start();
        foreach($__gatherData as $__gData) {
            extract($__gData, EXTR_OVERWRITE);
        }

        include ALGOL_TGSHOP_PLUGIN_PATH . '/views/' . $__view . '.php';

        array_pop($__gatherData);
        //return ltrim(ob_get_clean());
    }

    static function asset($asset)
    {
        $path = ALGOL_TGSHOP_PLUGIN_PATH. '/assets/' . $asset;
        $hash = substr(md5(filemtime($path)), 0, 10);
        $asset = ALGOL_TGSHOP_PLUGIN_URL . '/assets/' . $asset . '?id='. $hash;
        return $asset;
    }
}