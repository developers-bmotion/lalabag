<?php if($query_results->max_num_pages > 1) {
	$holder_styles = $this_object->getLoadMoreStyles($params);
	?>
	<div class="edgtf-pl-loading">
		<div class="edgtf-pl-loading-bounce1"></div>
		<div class="edgtf-pl-loading-bounce2"></div>
		<div class="edgtf-pl-loading-bounce3"></div>
	</div>
	<div class="edgtf-pl-load-more-holder">
		<div class="edgtf-pl-load-more" <?php elaine_edge_inline_style($holder_styles); ?>>
			<?php 
				echo elaine_edge_get_button_html(array(
					'link' => 'javascript: void(0)',
					'size' => 'medium',
					'text' => esc_html__('LOAD MORE', 'elaine-core'),
					'fe_icon' => 'arrow_carrot-right',
					'icon_pack' => 'font_elegant',
					'icon_params' => ''
				));
			?>
		</div>
	</div>
<?php }