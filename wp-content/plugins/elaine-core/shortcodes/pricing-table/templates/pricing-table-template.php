<div class="edgtf-price-table edgtf-item-space <?php echo esc_attr($holder_classes); ?>">
	<div class="edgtf-pt-inner" <?php echo elaine_edge_get_inline_style($holder_styles); ?>>
		<ul>
		    <li style="padding: 30px; margin-bottom: -50px;">
		        <?php if (esc_html($title) == 'LALABAG') { ?>
						<img src="https://lalabag.co/wp-content/uploads/2020/06/1-503x503-2.png" alt="" />
				<?php } else if (esc_html($title) == 'LALABAG CO') { ?>
						<img src="https://lalabag.co/wp-content/uploads/2020/06/4-503x503-2.png" alt="" />
                                <?php } else if (esc_html($title) == 'LALABAG PRO') { ?>
						<img src="https://lalabag.co/wp-content/uploads/2020/06/2-503x503-2.png" alt="" />
				<?php } else { ?>
						<img src="https://lalabag.co/wp-content/uploads/2020/06/503x503-4.png" alt="" />
				<?php } ?>
			</li>
			<li class="edgtf-pt-title-holder">
				<span class="edgtf-pt-title" <?php echo elaine_edge_get_inline_style($title_styles); ?>><?php echo esc_html($title); ?></span>
			</li>
			<li class="edgtf-pt-prices">
				<span class="edgtf-pt-value" <?php echo elaine_edge_get_inline_style($currency_styles); ?>><?php echo esc_html($currency); ?></span>
				<span class="edgtf-pt-price" <?php echo elaine_edge_get_inline_style($price_styles); ?>><?php echo esc_html($price); ?></span>
			</li>
			<li class="edgtf-pt-content">
				<?php echo do_shortcode($content); ?>
			</li>
			<?php
			if(!empty($button_text)) { ?>
				<li class="edgtf-pt-button">
					<?php echo elaine_edge_get_button_html(array(
						'link' => $link,
						'text' => $button_text,
						'type' => $button_type,
                        'size' => 'medium',
						'icon_pack' => "font_elegant",
						'fe_icon' => "arrow_carrot-right"

					)); ?>


				</li>
			<?php } ?>
		</ul>
	</div>
</div>
