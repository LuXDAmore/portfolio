// Router
export default {
    scrollBehavior(
        to,
        from,
        // savedPosition
    ) {

        const position = {
            left: 0,
            top: 0,
        };

        // ?: Questo hash strano può arrivare dai social-login per colpa della libreria di AWS, per cui non bisogna fare scroll in questo caso
        if( to.hash & to.has !== '#_=_' ) {

            try {

                const element = document.querySelector( to.hash );

                if( element ) {

                    position.left = 0;
                    position.top = element.offsetTop;

                    const [ focusableElement ] = element.querySelectorAll( 'input,button,select,textarea,a' );

                    if( focusableElement )
                        focusableElement.focus();

                    return position;

                }

            } catch( exception ) {

                if( process.env.NODE_ENV !== 'production' )
                    console.error( { exception } );

            }

        }

        if( to.fullPath !== from.fullPath ) {

            position.left = 0;
            position.top = 0;

        }

        /*
            if( savedPosition ) {

                position.left = savedPosition.left;
                position.top = savedPosition.top;

            }
        */

        // ?: Check if ScrollBehavior is supported
        if( 'scrollBehavior' in document.documentElement.style ) {

            window.scroll(
                {
                    behavior: 'smooth',
                    left: position.left,
                    top: position.top,
                }
            );

        } else {

            window.scroll(
                position.left,
                position.top,
            );

        }

        return position;

    },
};
