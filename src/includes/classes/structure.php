<?php

class Courusel extends AbricosItem {

    public $name;
    public $width;
    public $height;
    public $off;

    public function __construct($d) {
        parent::__construct($d);

        $this->name = strval($d['name']);
        $this->width = intval($d['width']);
        $this->height = intval($d['height']);
        $this->off = $d['off'] === 1;
    }

    public function ToAJAX() {
        $ret = parent::ToAJAX();
        $ret->name = $this->name;
        $ret->width = $this->width;
        $ret->height = $this->height;
        $ret->off = $this->off;
        return $ret;
    }
}

class CouruselList extends AbricosList {
}

class CouruselSlide extends AbricosItem {
    public $title;
    public $url;
    public $ord;
    public $filehash;

    public function __construct($d) {
        parent::__construct($d);
        $this->title = strval($d['title']);
        $this->url = strval($d['url']);
        $this->filehash = strval($d['filehash']);
        $this->ord = intval($d['ord']);
    }

    public function ToAJAX() {
        $ret = parent::ToAJAX();
        $ret->title = $this->title;
        $ret->url = $this->url;
        $ret->ord = $this->ord;
        $this->filehash = $this->filehash;
        return $ret;
    }
}

class CouruselSlideList extends AbricosList {
}

?>