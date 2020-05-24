<?php

if ( ! function_exists( 'elaine_edge_search_body_class' ) ) {
	/**
	 * Function that adds body classes for different search types
	 *
	 * @param $classes array original array of body classes
	 *
	 * @return array modified array of classes
	 */
	function elaine_edge_search_body_class( $classes ) {
		$classes[] = 'edgtf-fullscreen-search-with-sidebar';
		$classes[] = 'edgtf-search-fade';
		
		return $classes;
	}
	
	add_filter( 'body_class', 'elaine_edge_search_body_class' );
}

if ( ! function_exists( 'elaine_edge_get_search' ) ) {
	/**
	 * Loads search HTML based on search type option.
	 */
	function elaine_edge_get_search() {
        elaine_edge_load_search_template();
	}
	
	add_action( 'elaine_edge_action_before_page_header', 'elaine_edge_get_search' );
}

if ( ! function_exists( 'elaine_edge_load_search_template' ) ) {
	/**
	 * Loads search HTML based on search type option.
	 */
	function elaine_edge_load_search_template() {
        $parameters = array();

        $parameters['search_in_grid'] 			= elaine_edge_options()->getOptionValue( 'search_in_grid' ) == 'yes' ? 'edgtf-grid' : '';
        $parameters['search_close_icon_class'] 	= elaine_edge_get_search_close_icon_class();
        $parameters['search_submit_icon_class'] = elaine_edge_get_search_submit_icon_class();

        elaine_edge_get_module_template_part( 'types/fullscreen-with-sidebar/templates/fullscreen-with-sidebar', 'search', '', $parameters );
	}
}

if ( ! function_exists( 'elaine_edge_get_fullscreen_sidebar' ) ) {
    /**
     * Return footer top HTML
     */
    function elaine_edge_get_fullscreen_sidebar() {
        $parameters = array();

        //get number of top footer columns
        $parameters['search_sidebar_columns'] = elaine_edge_options()->getOptionValue( 'search_sidebar_columns' );


        elaine_edge_get_module_template_part( 'types/fullscreen-with-sidebar/templates/parts/fullscreen-sidebar', 'search', '', $parameters );
    }
}
