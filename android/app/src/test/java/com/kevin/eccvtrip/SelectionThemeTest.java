package com.kevin.eccvtrip;

import static org.junit.Assert.assertNull;

import android.app.Application;
import android.content.Context;
import android.view.ContextThemeWrapper;
import android.widget.FrameLayout;
import android.widget.ImageView;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.annotation.Config;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = 35, application = Application.class)
public class SelectionThemeTest {
    private void assertTransparentPopupAndHandleContainers(int theme) {
        Context context = new ContextThemeWrapper(RuntimeEnvironment.getApplication(), theme);
        // Android and WebView create popup/handle container views with the host theme.
        // A global android:background paints these even when the popup window is transparent.
        assertNull("Native popup containers must not inherit the page background",
            new FrameLayout(context).getBackground());
        assertNull("Selection handle views must keep their transparent surrounding area",
            new ImageView(context).getBackground());
    }

    @Test
    @Config(qualifiers = "notnight")
    public void lightThemeLeavesSelectionSurroundingsTransparent() {
        assertTransparentPopupAndHandleContainers(R.style.AppTheme_NoActionBar);
    }

    @Test
    @Config(qualifiers = "night")
    public void darkThemeLeavesSelectionSurroundingsTransparent() {
        assertTransparentPopupAndHandleContainers(R.style.AppTheme_NoActionBar);
    }

    @Test
    public void launchThemeDoesNotApplySplashToEveryView() {
        assertTransparentPopupAndHandleContainers(R.style.AppTheme_NoActionBarLaunch);
    }
}
