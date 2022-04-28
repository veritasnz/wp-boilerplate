<?php

/**
 * Theme Name: Projectname
 * Author: Sean Verity
 * @package projectname
 */

get_header();


$hero_slider = get_field("home_hero_slider", "option");

$hero_is_slider = false;
if (count($hero_slider) > 1) :
    $hero_is_slider = true;
endif;

if ($hero_slider) :
?>


    <div id="js-page-banner" class="t-home-hero">


        <?php if ($hero_is_slider) : ?>

            <div class="t-home-hero__slider swiper">

                <div class="swiper-wrapper">
                    <?php foreach ($hero_slider as $image) : ?>
                        <div class="swiper-slide">
                            <img src="<?= $image["url"]; ?>" alt="<?= $image["caption"]; ?>">
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- <div class="swiper-pagination"></div> -->
                <!-- <div class="swiper-button-prev"></div> -->
                <!-- <div class="swiper-button-next"></div> -->

            </div>

        <?php else : ?>

            <div class="t-home-hero__img">
                <img src="<?= $hero_slider[0]["url"]; ?>" alt="<?= $hero_slider[0]["caption"]; ?>">
            </div>

        <?php endif; ?>


    </div>


<?php endif; ?>


<!-- Home content goes here -->


<?php
get_footer();
