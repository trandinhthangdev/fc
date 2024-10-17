package com.domdomfc.wallpaper

import android.os.Handler
import android.os.Looper
import android.app.WallpaperManager
import android.graphics.BitmapFactory
import android.util.Base64
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.io.IOException

class WallpaperModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WallpaperModule"
    }

    @ReactMethod
    fun setWallpaper(base64Image: String, promise: Promise) {
        val wallpaperManager = WallpaperManager.getInstance(reactApplicationContext)
    
        // Run the operation on a background thread
        Thread {
            try {
                val decodedString = Base64.decode(base64Image, Base64.DEFAULT)
                val decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
                wallpaperManager.setBitmap(decodedByte)

                // Post the result back to the main thread
                Handler(Looper.getMainLooper()).post {
                    promise.resolve("Wallpaper set successfully")
                }
            } catch (e: Exception) {
                // Post the error back to the main thread
                Handler(Looper.getMainLooper()).post {
                    promise.reject("Error setting wallpaper", e)
                }
            }
        }.start()
    }
}
