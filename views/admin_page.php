<?php
/**
 * @var $tabs array
 * @var $currentTabKey string
 * @var $security string
 * @var $security_param string
 */
defined('ABSPATH') or exit;
?>

<h2 class="tgshop_tabs_container nav-tab-wrapper">
        <span class="tgshop_tabs_container_list">
            <?php
            foreach ($tabs as $tabKey => $tab): ?>
                <a class="nav-tab <?php
                echo($tabKey === $currentTabKey ? 'nav-tab-active' : ''); ?>"
                   href="admin.php?page=telegram_shop&tab=<?php
                   echo esc_attr($tabKey); ?>"><?php
                    echo esc_html($tab['label']); ?></a>
            <?php
            endforeach; ?>
        </span>
</h2>

<form class="tgshop_settings" method="post">
    <input type="hidden" name="<?php
    echo esc_attr($security_param); ?>" value="<?php
    echo esc_html($security); ?>"/>
    <?php
    $this->renderCurrentTab();
    ?>
</form>