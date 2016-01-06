'use strict';

/**
 * @ngdoc service
 * @name highcoreWebUI.drawerService
 * @description
 * # drawerService
 * Service in the highcoreWebUI.
 */
angular.module('highcoreWebUI')
    .service('drawerService', ['$rootScope', function ($rootScope) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return {
            getDrawerById: function(drawerId) {
                return jQuery('[data-drawer-id="' + drawerId + '"]');
            },
            toggle: function(drawerId) {
                if (this.getState(drawerId) == 'open') {
                    this.close(drawerId);
                } else {
                    this.open(drawerId);
                }
            },
            closeAll: function() {
                console.info('closeAllDrawers')
                jQuery('[data-component-id="drawer"]').each(function(index, drawerEl) {
                    console.info(arguments)
                });
            },
            getPosition: function(drawerId) {
                return this.getDrawerById(drawerId).attr('data-drawer-position');
            },
            setState: function(drawerId, state) {
                var $drawer = this.getDrawerById(drawerId);
                $drawer.attr('data-drawer-state', state);
            },
            getState: function(drawerId) {
                var $drawer = this.getDrawerById(drawerId);
                return $drawer.attr('data-drawer-state');
            },
            open: function(drawerId) {
                var $drawer = this.getDrawerById(drawerId),
                    animationOptions;


                switch (this.getPosition(drawerId)) {
                    case 'right':
                        animationOptions = {
                            right: 0
                        };
                        break;
                    case 'left':
                        animationOptions = {
                            left: 0
                        };
                        break;
                    case 'bottom':
                        animationOptions = {
                            bottom: 0
                        };
                        break;
                    default:
                        console.error('unknown position for drawer ', drawerId);
                }

                $drawer.animate(animationOptions, function() {
                    this.setState(drawerId, 'open')
                }.bind(this));

            },
            close: function(drawerId) {
                var $drawer                      = this.getDrawerById(drawerId),
                    $drawerContentContainer      = $drawer.find('[data-component-id="drawer-content"]'),
                    drawerContentContainerWidth  = $drawerContentContainer.width(),
                    drawerContentContainerHeight = $drawerContentContainer.height(),
                    animationOptions;

                switch (this.getPosition(drawerId)) {
                    case 'right':
                        animationOptions = {
                            right: drawerContentContainerWidth * -1
                        };
                        break;
                    case 'left':
                        animationOptions = {
                            left: drawerContentContainerWidth * -1
                        };
                        break;
                    case 'bottom':
                        animationOptions = {
                            bottom: drawerContentContainerHeight * -1
                        };
                        break;
                    default:
                    console.error('unknown position for drawer ', drawerId);
                }

                $drawer.animate(animationOptions, function() {
                    this.setState(drawerId, 'closed');
                    //$drawerContentContainer.hide();
                }.bind(this));
            }
        }
    }]);
