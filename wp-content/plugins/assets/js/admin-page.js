var builder = this.ec_builder || (this.ec_builder = {});
var utils = builder.Utils || (builder.Utils = {});
var functions = builder.Functions || (builder.Functions = {});
var settings = builder.Settings || (builder.Settings = {});
var templates = builder.Templates || (builder.Templates = {});

jQuery(document).on('click', '.ec-activate-modal', function () {
    jQuery('.ec-activate-updates-skip-container').hide();
    jQuery('#modal-activate').fadeIn();
});

jQuery(function () {
    jQuery('body').addClass('ec-body');

    jQuery('#footer-thankyou,#footer-upgrade').remove();
    jQuery('#ec_woo_order').change();

    setTimeout(function () {
        jQuery('#ec_woo_save_as_lang').addClass('ec-modal-input');
        jQuery('#ec_woo_save_as_lang').css('width', '30%');
    }, 100);

    if (woo_ec_vars.show_activate_updates == true) {
        jQuery('#modal-activate').fadeIn();
    }

    // var _top = jQuery('.ec-wrapper').position().top;
    // if (_top == 0) {
    //   jQuery('.ec-builder-header').css('margin-top', '32px');
    // } else if (_top > 32) {
    //   jQuery('.ec-builder-header').css('margin-top', '32px');
    // }
    var __height = jQuery('#wpadminbar').height() + jQuery('.ec-builder-header').height();
    jQuery('.ec-preview').css('margin-top', __height + 'px');

    scrollTop();


    var _is_demo = woo_ec_vars.is_demo;
    if (_is_demo) {
        var introguide = introJs();

        introguide.setOptions({
            showProgress: false
        });

        introguide.start();
    }


    var header_height = jQuery('.ec-builder-header').height() + jQuery('#wpadminbar').height();
    var total_height = jQuery(window).height();
    var height = Math.floor(((total_height - header_height) * 100) / total_height);

    jQuery('.ec-wrapper .ec-preview-content').css('height', (height - 2) + 'vh');

    setTimeout(function () {
        jQuery('.rangeSlider').remove();
        jQuery('.ec-panel-settings-slider').attr('style', '');
    }, 500);
});

jQuery(document).on('change', '.ec-settings-menu', function () {
    var _val = jQuery(this).val();
    var _data = {
        action: 'save_panel_position',
        position: _val
    };

    ajax_request(_data, function () {
        iziToast.success({
            title: 'Success!',
            message: 'Saved panel position',
            position: 'bottomRight'
        });
        jQuery('.ec-builder-header').attr('style', '');
        jQuery('.ec-panel').attr('style', '');

        if (_val === 'left') {
            jQuery('.ec-wrapper').removeClass('ec-panel-right');
        } else {
            jQuery('.ec-wrapper').addClass('ec-panel-right');
            jQuery('.ec-preview').css('margin-left', '');
        }
    });
});

jQuery(document).on('click', '.ec-modal-library-grid-item .ec-modal-library-grid-row', function () {
    var _self = jQuery(this);
    var _parent = _self.parent();
    var _list = _parent.find('.ec-modal-library-grid-item-list');

    if (_parent.hasClass('collapsed')) {
        _list.slideDown(300, function () {
            _parent.removeClass('collapsed');
        });
    } else {
        _list.slideUp(300, function () {
            _parent.addClass('collapsed');
        });
    }

});
jQuery(document).on('click', '#settings-image-change', function () {
    if (window_media === undefined) {
        var window_media = wp.media({
            title: 'Select a media',
            library: {
                type: 'image'
            },
            multiple: false,
            button: {
                text: 'Select'
            }
        });

        var self = this; // Needed to retrieve our variable in the anonymous function below
        window_media.on('select', function () {
            var first = window_media.state().get('selection').first().toJSON();
            jQuery('#settings-image-source-url').val(first.url);
            jQuery('#settings-image-source-url').change();
        });
    }

    window_media.open();
});

jQuery(document).on('click', '.ec-modal-input-container.active #ec-import-submit', function () {
    var __self = jQuery(this);

    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var $label = __self.find('.ec-modal-input-submit-label');
    var $loading = __self.find('.ec-modal-input-submit-loading');

    __self.addClass('ec-clicked');
    $label.hide();
    $loading.show();

    var file_data = jQuery('#import-file').prop('files')[0];
    var _ajax_url = woo_ec_vars.ajax_url;


    var form_data = new FormData();
    form_data.append('import_file', file_data);
    form_data.append('action', 'import_json');
    jQuery.ajax({
        url: _ajax_url,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function (response) {
            data = jsonParse(response.data);
            functions.import_json(data, true);
            jQuery('#modal-import').fadeOut();
            __self.removeClass('ec-clicked');
            $label.show();
            $loading.hide();
            changeImgWidthOnLoadedTemplate();
        }
    });
});

jQuery(document).on('click', '.ec-modal-input-container.active #ec-import-all-submit', function () {
    var __self = jQuery(this);

    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var $label = __self.find('.ec-modal-input-submit-label');
    var $loading = __self.find('.ec-modal-input-submit-loading');
    var $labelError = jQuery('#ec-import-all-file-error');

    __self.addClass('ec-clicked');
    $label.hide();
    $loading.show();

    var file_data = jQuery('#import-all-file').prop('files')[0];
    var _ajax_url = woo_ec_vars.ajax_url;


    var form_data = new FormData();
    form_data.append('import_file', file_data);
    form_data.append('action', 'import_all');
    jQuery.ajax({
        url: _ajax_url,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function (response) {
            data = jsonParse(response);
            if (data.code!=200) {
              $label.show();
              $loading.hide();
              $labelError.text('Could not read JSON file');
              $labelError.show();
            }

            jQuery('#modal-import-all').fadeOut();
            __self.removeClass('ec-clicked');
            $label.show();
            $loading.hide();

        }
    });
});

jQuery(document).on('click', '#ec-email-submit', function () {
    var __self = jQuery(this);
    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var $email = jQuery('#ec-email-address');

    if ($email.val() == '') {
        $email.addClass('ec-modal-input-has-error');
        return false;
    }
    $email.removeClass('ec-modal-input-has-error');
    var $loading = jQuery('.ec-modal-input-submit-loading');
    var $label = jQuery('.ec-modal-input-submit-label');

    var __html = functions.export_html(false);
    var _data = {
        action: 'send_email',
        email: $email.val(),
        lang: jQuery('#ec_woo_lang').val(),
        order_id: jQuery('#ec_woo_order').val(),
        email_type: jQuery('#ec_woo_type').val(),
        html: __html
    };

    $label.hide();
    $loading.show();
    __self.addClass('ec-clicked');

    ajax_request(_data, function () {
        iziToast.success({
            title: 'Sent email!',
            message: 'Please check your email address',
            position: 'bottomRight'
        });

        $label.show();
        $loading.hide();
        __self.removeClass('ec-clicked');

        jQuery('#modal-send-email').fadeOut();

    }, function () {
        $label.show();
        $loading.hide();
        __self.removeClass('ec-clicked');
    });
});
var shortcode_docs;
var __load_template = function () {
    // utils.remove_modal(function() {
    //   console.log('yessss');
    // });
    if (jQuery('.ec-tab-styles').hasClass('ec-active')) {
        jQuery('.ec-panel-header-icon').click();
    }
    jQuery('.ec-preview').addClass('ec-loading');
    jQuery('.ec-preview-content-wrapper').hide();

    if (jQuery('#ec_woo_type').val()=='') {
      jQuery('.ec-preview-content-wrapper').show();
      jQuery('.ec-preview').removeClass('ec-loading');
      return;
    }
    var data = {
        action: 'template_load',
        lang: jQuery('#ec_woo_lang').val(),
        type: jQuery('#ec_woo_type').val(),
        order_id: jQuery('#ec_woo_order').val()
    };

    ajax_request(data, function (response) {
        //response = jsonParse(response);
        shortcode_list = response.shortcode_data;
        shortcode_docs = response.shortcode_json;

        if (response.replace_email == '1') {
            jQuery('#ec-settings-replace-mail-for-type').prop("checked", true);
        } else {
            jQuery('#ec-settings-replace-mail-for-type').prop("checked", false);
        }

        settings.tinymce_tags = jsonParse(response.shortcode_json);
        functions.tinymce_generate(response.shortcode_json);
        functions.settings_text_helper();

        for (var i = 0; i < utils.loadFuntions.length; i++) {
            utils.loadFuntions[i]();
        }
        var __email = response.email;
        if (__email != undefined) {
            if (__email.length > 0) {
                functions.import_json(jsonParse(__email), true);
                generate_shortcode_for_all_text();
            } else {
                utils.load_default_row();
            }

        } else {
            utils.load_default_row();
        }
        jQuery('.ec-preview-content-wrapper').show();
        jQuery('.ec-preview').removeClass('ec-loading');
        changeImgWidthOnLoadedTemplate();

    });
}

var changeImgWidthOnLoadedTemplate=function () {
  jQuery('#settings-email-width').change();
}

jQuery(document).on('change', '#ec_woo_type', function () {

    var $type = jQuery('#ec_woo_type');
    if ($type.val() != '') {
        __load_template();
        $type.find('option[value=""]').remove();
        enable_save_template();
        check_email_rtl_support();
        jQuery('.ec-woo-replace-email-type').text("'" + jQuery("#ec_woo_type option:selected").text().trim() + "'");
    }

    //collapse settings panel
    jQuery('.ec-panel-tab-content-item[data-tab="settings"] .ec-panel-settings-item').addClass('collapsed');
    jQuery('.ec-panel-tab-content-item[data-tab="settings"] .ec-panel-settings-content').hide();
    // open first one
    jQuery('#ec-woo-email-settings-panel').removeClass('collapsed').addClass('active');
    jQuery('#ec-woo-email-settings-panel .ec-panel-settings-content').show();


});
jQuery(document).on('change', '#ec_woo_order', function () {
    __load_template();
});
jQuery(document).on('change', '#ec_woo_lang', function () {
    __load_template();
});

jQuery(document).on('click', '.ec-preview-header-control-item.ec-control-save', function () {
    if (woo_ec_vars.is_demo == true) {
        alert('DEMO ! You cannot change it !')
        return false;
    }
    var __self = jQuery(this);
    if (__self.hasClass('ec-control-save-disabled')) {
        return false;
    }

    var $loading = jQuery('.ec-save-loading');
    var $label = jQuery('.ec-save-label');
    __self.addClass('ec-control-save-disabled');

    var __exported_json = functions.export_json();
    var data = {
        action: 'template_save',
        lang: jQuery('#ec_woo_lang').val(),
        type: jQuery('#ec_woo_type').val(),
        email: __exported_json//btoa(unescape(encodeURIComponent(__exported_json)))
    };

    $label.hide();
    $loading.show();

    ajax_request(data, function (response) {

        $label.show();
        $loading.hide();
        __self.removeClass('ec-control-save-disabled');
        iziToast.success({
            title: 'Success!',
            message: 'Template saved successfully',
            position: 'bottomRight'
        });
    });
});


jQuery(document).on('click', '#ec-modal-template-save', function () {
    var __self = jQuery(this);

    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var $label = __self.find('.ec-modal-input-submit-label');
    var $loading = __self.find('.ec-modal-input-submit-loading');
    var $name = jQuery('#ec-modal-template-name');

    if ($name.val().length == 0) {
        $name.addClass('ec-modal-input-has-error');
        return false;
    }

    $name.removeClass('ec-modal-input-has-error');
    __self.addClass('ec-clicked');
    $label.hide();
    $loading.show();

    var __html = functions.export_json();

    var data = {
        action: 'template_new_save',
        email: __html,
        name: $name.val()
    };

    ajax_request(data, function (response) {
        load_saved_templates(function () {
            jQuery('#modal-save').hide();
            jQuery('#modal-library .ec-modal-library-content').show();
            jQuery('#modal-library .ec-modal-library-preview').hide();

            jQuery('#modal-library').show();
            jQuery('.ec-modal-library-tabs-item[data-content="#modal-library-my-templates"]').click();

            $name.val('');
            __self.removeClass('ec-clicked');
            $label.show();
            $loading.hide();
        });


    });

});


jQuery(document).on('click', '.ec-modal-library-grid-action-item.ec-modal-library-grid-action-delete', function () {
    var __self = jQuery(this);
    var __row = __self.parents('.ec-modal-library-grid-row');

    var $controls = __row.find('.ec-modal-library-grid-action-list');
    var $loading = __row.find('.ec-modal-library-grid-action-loading');

    $controls.hide();
    $loading.show();

    var data = {
        action: 'template_delete_saved',
        id: __row.attr('data-id')
    };


    ajax_request(data, function (response) {
        iziToast.success({
            title: 'SUCCESS',
            message: 'Template deleted',
            position: 'bottomRight'
        });
        __row.remove();

    }, function () {
        $controls.show();
        $loading.hide();
    });

});


jQuery(document).on('click', '.ec-modal-library-grid-action-item.ec-modal-library-grid-action-insert', function () {
    var __self = jQuery(this);
    var __row = __self.parents('.ec-modal-library-grid-row');

    var $controls = __row.find('.ec-modal-library-grid-action-list');
    var $loading = __row.find('.ec-modal-library-grid-action-loading');
    var $modal = jQuery('#modal-library');


    var _id = __row.attr('data-id');
    $controls.hide();
    $loading.show();

    setTimeout(function () {
        var _data = jsonParse(utils.saved_templates.where(_id)[0].data);

        functions.import_json(_data, true);
        generate_shortcode_for_all_text();

        $controls.show();
        $loading.hide();
        $modal.fadeOut();
    }, 300);


});


jQuery(document).on('click', '#ec-modal-template-save-as', function () {
    var __self = jQuery(this);
    var $type = jQuery('#ec_woo_save_as_email_type');
    var $lang = jQuery('#ec_woo_save_as_lang');
    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var has_error = false;
    // if ($lang.val() == '') {
    //   has_error = true;
    //   $lang.addClass('ec-modal-input-has-error');
    // }
    if ($type.val() == '') {
        has_error = true;
        $type.addClass('ec-modal-input-has-error');
    }

    if (has_error == true) {
        return false;
    }

    $type.removeClass('ec-modal-input-has-error');
    var $loading = jQuery('.ec-modal-input-submit-loading');
    var $label = jQuery('.ec-modal-input-submit-label');

    var __exported_json = functions.export_json();
    var data = {
        action: 'template_save_as',
        lang: $lang.val(),
        type: $type.val(),
        email: __exported_json
    };

    $label.hide();
    $loading.show();
    __self.addClass('ec-clicked');

    ajax_request(data, function (response) {

        $label.show();
        $loading.hide();
        __self.removeClass('ec-clicked');
        jQuery('#modal-save-as').fadeOut();
        iziToast.success({
            title: 'Success!',
            message: 'Saved successfully',
            position: 'bottomRight'
        });
    });
});


jQuery(document).on('change', '#ec-settings-show-product-img', function () {
    var _self = jQuery(this);
    if (_self.is(':checked')) {
        jQuery('.ec-settings-product-image').show();
    } else {
        jQuery('.ec-settings-product-image').hide();
    }
});

function check_email_rtl_support() {
    if (jQuery('#ec-settings-rtl').is(":checked")) {
        jQuery('.ec-preview-content-body *').attr('dir', 'rtl');
        jQuery('.woo-items-list-5 *').removeAttr('dir');
        jQuery('.woo-items-list-5').attr('dir', 'rtl');
    } else {
        jQuery('.ec-preview-content-body *').attr('dir', 'ltr');
        jQuery('.woo-items-list-5 *').removeAttr('dir');
        jQuery('.woo-items-list-5').attr('dir', 'ltr');
    }
}

jQuery(document).on('click', '#save_general_settings', function () {
    var _self=jQuery(this);
    if (_self.attr('loading')=='yes') {
      return;
    }
    _self.attr('loading','yes');
    _self.text('Loading...');
    // if (jQuery(this).hasClass('single-request')) {
    //     return;
    // }
    var data = {
        action: 'save_settings',
        img_width: jQuery('#ec-settings-product-img-width').val(),
        img_height: jQuery('#ec-settings-product-img-height').val(),
        show_img: jQuery('#ec-settings-show-product-img').is(":checked") == true ? 1 : 0,
        show_sku: jQuery('#ec-settings-show-product-sku').is(":checked") == true ? 1 : 0,
        replace_mail: jQuery('#ec-settings-replace-mail').is(":checked") == true ? 1 : 0,
        rtl: jQuery('#ec-settings-rtl').is(":checked") == true ? 1 : 0,
        cell_padding: jQuery('#ec-settings-border-padding').val(),
        email_type: jQuery('#ec_woo_type').val(),
        show_custom_shortcode: jQuery('#ec-settings-show-custom-shortcode').is(":checked") == true ? 1 : 0,
        replace_email_type: jQuery('#ec-settings-replace-mail-for-type').is(":checked") == true ? 1 : 0,
        show_meta: jQuery('#ec-settings-show-meta').is(":checked") == true ? 1 : 0,
    };

    check_email_rtl_support();

    ajax_request(data, function (response) {
        jQuery('#ec_woo_order').change();
        iziToast.success({
            title: 'Success!',
            message: 'Settings saved',
            position: 'bottomRight'
        });
        _self.removeAttr('loading');
        _self.text('Save');
    },function () {
      _self.removeAttr('loading');
      _self.text('Save');
    });
});

jQuery(document).on('click', '#save_related_items', function () {
    var _self=jQuery(this);
    if (_self.attr('loading')=='yes') {
      return;
    }
    _self.attr('loading','yes');
    _self.text('Loading...');

    var data = {
        action: 'save_related_items',
        columns: jQuery('#ec-related-items-columns').val(),
        count: jQuery('#ec-related-items-count').val(),
        products_by: jQuery('#ec-related-items-products-by').val(),
        show_price: jQuery('#ec-related-items-show-price').is(":checked") == true ? 1 : 0,
        show_name: jQuery('#ec-related-items-show-name').is(":checked") == true ? 1 : 0,
        show_image: jQuery('#ec-related-items-show-image').is(":checked") == true ? 1 : 0
    };

    ajax_request(data, function (response) {
        jQuery('#ec_woo_order').change();
        iziToast.success({
            title: 'Success!',
            message: 'Related Items Settings saved',
            position: 'bottomRight'
        });
        _self.removeAttr('loading');
        _self.text('Save');
    },function () {
      _self.removeAttr('loading');
      _self.text('Save');
    });
});

jQuery(document).on('change', '#ec-settings-replace-mail-for-type', function () {

    var data = {
        action: 'save_settings_replace_email_type',
        email_type: jQuery('#ec_woo_type').val(),
        replace_email_type: jQuery('#ec-settings-replace-mail-for-type').is(":checked") == true ? 1 : 0
    };

    check_email_rtl_support();

    ajax_request(data, function (response) {
        jQuery('#ec_woo_order').change();
        iziToast.success({
            title: 'Success!',
            message: 'Settings saved',
            position: 'bottomRight'
        });
    });
});

jQuery(document).on('click', '#save_custom_css', function () {
    var data = {
        action: 'save_custom_css',
        custom_css: jQuery('#custom_css').val()
    };

    ajax_request(data, function (response) {
        jQuery('#page-custom-style').html(jQuery('#custom_css').val());
        iziToast.success({
            title: 'Success!',
            message: 'Custom CSS saved',
            position: 'bottomRight'
        });

    });
});


// Setup isScrolling variable
var isScrolling;

// Listen for scroll events
window.addEventListener('scroll', function (event) {

    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function () {

        // Run the callback
        //console.log('Scrolling has stopped.');
        window.scrollTo(0, 0);
    }, 66);

}, false);

jQuery(document).on('click', '.ec-control-help', function () {
    jQuery('.ec-modal-library-content').show();
    jQuery('#modal-help').fadeIn();
});

jQuery(document).on('click', '.ec-email-preview', function () {
    var _loading = jQuery('#modal-preview .ec-modal-library-preview-content-loading');
    var _iframe = jQuery('#modal-preview .ec-modal-library-preview-content-frame');
    _iframe.hide();
    _loading.show();
    var _type = jQuery('#ec_woo_type').val();
    var _id = jQuery('#ec_woo_order').val();
    var _url = woo_ec_vars.admin_url + 'admin.php?page=' + woo_ec_vars.preview + '&ecwoo_render_email=yes&ecwoo_email_type=' + _type + '&ecwoo_email_order=' + _id + '&ecwoo_in_popup=true';
    _iframe.attr('src', _url);
    _iframe.on('load', function () {
        _iframe.show();
        _loading.hide();
    });
    jQuery('#modal-preview').fadeIn();
});


jQuery(document).on('click', '#ec-activate-updates-submit', function () {
    var __self = jQuery(this);
    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var $purchase_code = jQuery('#ec-purchase-code');

    if ($purchase_code.val() == '') {
        $purchase_code.addClass('ec-modal-input-has-error');
        return false;
    }
    $purchase_code.removeClass('ec-modal-input-has-error');
    var $loading = __self.find('.ec-modal-input-submit-loading');
    var $label = __self.find('.ec-modal-input-submit-label');

    var _data = {
        action: 'activate_updates',
        purchase_code: $purchase_code.val()
    };

    $label.hide();
    $loading.show();
    __self.addClass('ec-clicked');
    jQuery('#ec-activate-updates-error').html('');
    ajax_request(_data, function () {
        iziToast.success({
            title: 'Updates activated!',
            message: '',
            position: 'bottomRight'
        });

        $label.show();
        $loading.hide();
        __self.removeClass('ec-clicked');

        jQuery('#modal-activate').fadeOut();

    }, function (response) {
        jQuery('#ec-activate-updates-error').html(response.message);
        $label.show();
        $loading.hide();
        __self.removeClass('ec-clicked');
    });
});

jQuery(document).on('click', '#ec-activate-updates-skip', function () {
    var __self = jQuery(this);
    if (__self.hasClass('ec-clicked')) {
        return false;
    }
    var _data = {
        action: 'skip_activate_updates'
    };
    ajax_request(_data, function () {
        iziToast.success({
            title: 'Activate updates skipped!',
            message: '',
            position: 'bottomRight'
        });
        __self.removeClass('ec-clicked');
        jQuery('#modal-activate').fadeOut();

    }, function () {
        __self.removeClass('ec-clicked');
    });

    return false;
});

jQuery(document).on('click', '.ec-export-all', function(e) {
  var _self = jQuery(this);
  if (_self.parents('.ec-control-export').hasClass('ec-preview-header-control-item-disable')) {
    return false;
  }

  var __data = {
    action: 'export_all'
  };

  //use loader in main page

  ajax_request(__data, function(response) {
    window.location.href = response.url;
    jQuery(document).click();
  });
});