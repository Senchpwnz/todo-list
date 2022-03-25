export const fontIcons = () => {
    return app.gulp.src(`${app.path.srcFolder}/fonts/fontIcons/*.*`, {})
        .pipe(app.gulp.dest(`${app.path.build.fonts}/fontIcons/`));
}