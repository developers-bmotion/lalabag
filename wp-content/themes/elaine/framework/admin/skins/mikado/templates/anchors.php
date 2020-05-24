<div class="edgtf-anchor-holder">
    <?php if(is_array($page->layout) && count($page->layout)) { ?>
        <span><?php esc_html_e('Scroll To:', 'elaine') ?></span>
        <select class="nav-select edgtf-selectpicker" data-width="315px" data-hide-disabled="true" data-live-search="true" id="edgtf-select-anchor">
            <option value="" disabled selected></option>
            <?php foreach ($page->layout as $panel) { ?>
                <option data-anchor="#edgtf_<?php echo esc_attr($panel->name); ?>"><?php echo esc_attr($panel->title); ?></option>
            <?php } ?>
        </select>
    <?php } ?>
</div>