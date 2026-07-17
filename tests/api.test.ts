import { beforeEach, describe, expect, it, vi } from "vitest";

const invoke = vi.fn();
const listen = vi.fn();

vi.mock("@tauri-apps/api/core", () => ({
  invoke
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen
}));

beforeEach(() => {
  vi.resetModules();
  invoke.mockReset();
  listen.mockReset();
  vi.stubGlobal("window", { __TAURI_INTERNALS__: {} });
});

describe("download API", () => {
  it("updates local updater preferences through the app update settings command", async () => {
    invoke.mockResolvedValueOnce({
      schema_version: 1,
      enabled: true,
      manifest_path: "C:/Releases/fetchdock-update.json",
      check_interval_hours: 12,
      last_checked_at: null,
      last_result: null
    });
    const { updateUpdateSettings } = await import("../src/lib/api");

    const result = await updateUpdateSettings({
      enabled: true,
      manifestPath: "C:/Releases/fetchdock-update.json",
      checkIntervalHours: 12
    });

    expect(invoke).toHaveBeenCalledWith("app_update_update_settings", {
      request: {
        patch: {
          enabled: true,
          manifest_path: "C:/Releases/fetchdock-update.json",
          check_interval_hours: 12,
          last_checked_at: undefined,
          last_result: undefined
        }
      }
    });
    expect(result?.check_interval_hours).toBe(12);
  });

  it("checks plugin host preflight through the plugin command", async () => {
    invoke.mockResolvedValueOnce({
      schema_version: 1,
      id: "media.convert",
      display_name: "Media Convert",
      version: "0.1.0",
      abi_version: "fetchdock-plugin-abi-1",
      host_abi_version: "fetchdock-plugin-abi-1",
      state: "disabled",
      dynamic_library_path: "C:/FetchDock/plugins/installed/media.convert/plugin.dll",
      entrypoint: "fetchdock_plugin_entry",
      preflight_status: "ready_local",
      preflight_message: "Dynamic library preflight passed; runtime loading remains disabled in this implementation subset.",
      capabilities: ["media.convert"],
      commands: ["convert.run"],
      events: [{ name: "convert.completed", description: "Conversion completed" }],
      nav_items: [],
      settings_schema: null,
      installed_at: null,
      updated_at: null,
      last_error: null,
      manifest_path: "C:/FetchDock/plugins/installed/media.convert/plugin.json"
    });
    const { checkPluginHost } = await import("../src/lib/api");

    const result = await checkPluginHost("media.convert");

    expect(invoke).toHaveBeenCalledWith("plugins_check_host", {
      request: { id: "media.convert" }
    });
    expect(result?.preflight_status).toBe("ready_local");
  });

  it("polls due channels through the channel command", async () => {
    invoke.mockResolvedValueOnce({
      checked: 1,
      created_task_count: 1,
      items: [
        {
          schema_version: 1,
          id: "history-1",
          channel_id: "channel-1",
          source_url: "https://video.example/watch/abc",
          title: "New upload",
          checked_at: "2026-07-13T00:00:00Z",
          created_task_id: "task-1",
          notification_status: "pending"
        }
      ],
      settings: {
        schema_version: 1,
        auto_poll_enabled: true,
        poll_interval_minutes: 60,
        last_poll_started_at: "2026-07-13T00:00:00Z",
        last_poll_finished_at: "2026-07-13T00:00:01Z",
        last_error: null
      }
    });
    const { pollDueChannels } = await import("../src/lib/api");

    const result = await pollDueChannels();

    expect(invoke).toHaveBeenCalledWith("channels_poll_due");
    expect(result?.created_task_count).toBe(1);
  });

  it("probes metadata through the yt-dlp preview command", async () => {
    invoke.mockResolvedValueOnce({
      schema_version: 1,
      source_url: "https://video.example/watch/abc",
      platform: "generic",
      title: "Launch Walkthrough",
      author: "FetchDock Team",
      thumbnail_url: "https://img.example/thumb.jpg",
      duration_seconds: 126,
      formats: [{ id: "18", label: "360p", ext: "mp4", height: 360 }]
    });
    const { probeMetadataUrl } = await import("../src/lib/api");

    const preview = await probeMetadataUrl("https://video.example/watch/abc");

    expect(invoke).toHaveBeenCalledWith("metadata_probe_url", {
      request: { source_url: "https://video.example/watch/abc" }
    });
    expect(preview?.formats[0].id).toBe("18");
  });

  it("lists subtitles through the metadata subtitle command", async () => {
    invoke.mockResolvedValueOnce({
      subtitles: [
        {
          language: "en",
          name: "English",
          formats: ["vtt", "ttml"],
          is_auto: false
        }
      ]
    });
    const { listMetadataSubtitles } = await import("../src/lib/api");

    const result = await listMetadataSubtitles("https://video.example/watch/abc");

    expect(invoke).toHaveBeenCalledWith("metadata_list_subtitles", {
      request: { url: "https://video.example/watch/abc" }
    });
    expect(result.subtitles[0].language).toBe("en");
    expect(result.subtitles[0].formats).toEqual(["vtt", "ttml"]);
  });

  it("saves a selected subtitle through the metadata subtitle command", async () => {
    invoke.mockResolvedValueOnce({
      output_path: "C:/Downloads/subtitle-output.vtt"
    });
    const { saveMetadataSubtitle } = await import("../src/lib/api");

    const result = await saveMetadataSubtitle({
      url: "https://video.example/watch/abc",
      language: "en",
      format: "vtt",
      isAuto: false,
      outputDir: "C:/Downloads"
    });

    expect(invoke).toHaveBeenCalledWith("metadata_save_subtitle", {
      request: {
        url: "https://video.example/watch/abc",
        language: "en",
        format: "vtt",
        is_auto: false,
        output_dir: "C:/Downloads"
      }
    });
    expect(result.output_path).toBe("C:/Downloads/subtitle-output.vtt");
  });

  it("merges local subtitle files through the metadata subtitle command", async () => {
    invoke.mockResolvedValueOnce({
      output_path: "C:/Downloads/merged.vtt",
      merged_count: 2
    });
    const { mergeMetadataSubtitles } = await import("../src/lib/api");

    const result = await mergeMetadataSubtitles({
      inputPaths: ["C:/Downloads/en.vtt", "C:/Downloads/ja.vtt"],
      outputPath: "C:/Downloads/merged.vtt"
    });

    expect(invoke).toHaveBeenCalledWith("metadata_merge_subtitles", {
      request: {
        input_paths: ["C:/Downloads/en.vtt", "C:/Downloads/ja.vtt"],
        output_path: "C:/Downloads/merged.vtt"
      }
    });
    expect(result.merged_count).toBe(2);
  });

  it("opens and saves local subtitles through the subtitle workshop commands", async () => {
    invoke
      .mockResolvedValueOnce({
        path: "C:/Subtitles/source.srt",
        format: "srt",
        content: "1\n00:00:00,000 --> 00:00:01,000\nHello\n",
        line_count: 3
      })
      .mockResolvedValueOnce({
        output_path: "C:/Subtitles/edited.vtt",
        format: "vtt",
        line_count: 4
      });
    const { openSubtitleWorkshopFile, saveSubtitleWorkshopFile } = await import("../src/lib/api");

    const opened = await openSubtitleWorkshopFile("C:/Subtitles/source.srt");
    const saved = await saveSubtitleWorkshopFile({
      outputPath: "C:/Subtitles/edited.vtt",
      content: "WEBVTT\n\n00:00.000 --> 00:01.000\nHello\n"
    });

    expect(invoke).toHaveBeenNthCalledWith(1, "subtitle_workshop_open", {
      request: { input_path: "C:/Subtitles/source.srt" }
    });
    expect(invoke).toHaveBeenNthCalledWith(2, "subtitle_workshop_save", {
      request: {
        output_path: "C:/Subtitles/edited.vtt",
        content: "WEBVTT\n\n00:00.000 --> 00:01.000\nHello\n"
      }
    });
    expect(opened.format).toBe("srt");
    expect(saved.line_count).toBe(4);
  });

  it("lists thumbnails through the metadata thumbnail command", async () => {
    invoke.mockResolvedValueOnce({
      thumbnails: [
        {
          id: "hqdefault",
          url: "https://img.example/hqdefault.jpg",
          width: 480,
          height: 360,
          preference: 1
        }
      ]
    });
    const { listMetadataThumbnails } = await import("../src/lib/api");

    const result = await listMetadataThumbnails("https://video.example/watch/abc");

    expect(invoke).toHaveBeenCalledWith("metadata_list_thumbnails", {
      request: { url: "https://video.example/watch/abc" }
    });
    expect(result.thumbnails[0].id).toBe("hqdefault");
    expect(result.thumbnails[0].url).toBe("https://img.example/hqdefault.jpg");
  });

  it("saves a selected thumbnail through the metadata thumbnail command", async () => {
    invoke.mockResolvedValueOnce({
      output_path: "C:/Downloads/thumb.jpg"
    });
    const { saveMetadataThumbnail } = await import("../src/lib/api");

    const result = await saveMetadataThumbnail({
      url: "https://img.example/hqdefault.jpg",
      outputDir: "C:/Downloads",
      fileName: "thumb.jpg",
      options: {
        userAgent: "FetchDock Test",
        referer: "https://video.example/watch/abc",
        proxy: "http://127.0.0.1:8080",
        cookieBucketId: "cookie-123",
        authPayloadRef: "auth-456",
        rateLimit: "512K"
      }
    });

    expect(invoke).toHaveBeenCalledWith("metadata_save_thumbnail", {
      request: {
        url: "https://img.example/hqdefault.jpg",
        output_dir: "C:/Downloads",
        file_name: "thumb.jpg",
        user_agent: "FetchDock Test",
        referer: "https://video.example/watch/abc",
        proxy: "http://127.0.0.1:8080",
        cookie_bucket_id: "cookie-123",
        auth_payload_ref: "auth-456",
        rate_limit: "512K"
      }
    });
    expect(result.output_path).toBe("C:/Downloads/thumb.jpg");
  });

  it("lists chapters through the metadata chapters command", async () => {
    invoke.mockResolvedValueOnce({
      chapters: [
        {
          title: "Intro",
          start_seconds: 0,
          end_seconds: 12.5
        }
      ]
    });
    const { listMetadataChapters } = await import("../src/lib/api");

    const result = await listMetadataChapters("https://video.example/watch/abc");

    expect(invoke).toHaveBeenCalledWith("metadata_list_chapters", {
      request: { url: "https://video.example/watch/abc" }
    });
    expect(result.chapters[0].title).toBe("Intro");
    expect(result.chapters[0].end_seconds).toBe(12.5);
  });

  it("saves chapters through the metadata chapters command", async () => {
    invoke.mockResolvedValueOnce({
      output_path: "C:/Downloads/chapters.json",
      chapter_count: 2
    });
    const { saveMetadataChapters } = await import("../src/lib/api");

    const result = await saveMetadataChapters({
      url: "https://video.example/watch/abc",
      outputDir: "C:/Downloads",
      fileName: "chapters.json"
    });

    expect(invoke).toHaveBeenCalledWith("metadata_save_chapters", {
      request: {
        url: "https://video.example/watch/abc",
        output_dir: "C:/Downloads",
        file_name: "chapters.json"
      }
    });
    expect(result.chapter_count).toBe(2);
  });

  it("saves comments through the metadata comments command", async () => {
    invoke.mockResolvedValueOnce({
      output_path: "C:/Downloads/comments.info.json"
    });
    const { saveMetadataComments } = await import("../src/lib/api");

    const result = await saveMetadataComments({
      url: "https://video.example/watch/abc",
      outputDir: "C:/Downloads"
    });

    expect(invoke).toHaveBeenCalledWith("metadata_save_comments", {
      request: {
        url: "https://video.example/watch/abc",
        output_dir: "C:/Downloads"
      }
    });
    expect(result.output_path).toBe("C:/Downloads/comments.info.json");
  });

  it("lists comments through the metadata comments command", async () => {
    invoke.mockResolvedValueOnce({
      comments: [
        {
          id: "c1",
          author: "Viewer One",
          text: "Helpful walkthrough.",
          timestamp_seconds: 12,
          like_count: 5,
          reply_count: 1
        }
      ]
    });
    const { listMetadataComments } = await import("../src/lib/api");

    const result = await listMetadataComments("https://video.example/watch/abc");

    expect(invoke).toHaveBeenCalledWith("metadata_list_comments", {
      request: { url: "https://video.example/watch/abc" }
    });
    expect(result.comments[0].author).toBe("Viewer One");
    expect(result.comments[0].timestamp_seconds).toBe(12);
  });

  it("saves live chat through the metadata live chat command", async () => {
    invoke.mockResolvedValueOnce({
      output_path: "C:/Downloads/live_chat.json"
    });
    const { saveMetadataLiveChat } = await import("../src/lib/api");

    const result = await saveMetadataLiveChat({
      url: "https://video.example/watch/live",
      outputDir: "C:/Downloads"
    });

    expect(invoke).toHaveBeenCalledWith("metadata_save_live_chat", {
      request: {
        url: "https://video.example/watch/live",
        output_dir: "C:/Downloads"
      }
    });
    expect(result.output_path).toBe("C:/Downloads/live_chat.json");
  });

  it("saves full metadata through the metadata info JSON command", async () => {
    invoke.mockResolvedValueOnce({
      output_path: "C:/Downloads/video.info.json"
    });
    const { saveMetadataInfoJson } = await import("../src/lib/api");

    const result = await saveMetadataInfoJson({
      url: "https://video.example/watch/abc",
      outputDir: "C:/Downloads"
    });

    expect(invoke).toHaveBeenCalledWith("metadata_save_info_json", {
      request: {
        url: "https://video.example/watch/abc",
        output_dir: "C:/Downloads"
      }
    });
    expect(result.output_path).toBe("C:/Downloads/video.info.json");
  });

  it("clips a local video through the media clip command", async () => {
    invoke.mockResolvedValueOnce({
      job_id: "clip-job-1",
      output_path: "C:/Downloads/clip.mp4"
    });
    const { clipVideo } = await import("../src/lib/api");

    const result = await clipVideo({
      jobId: "clip-job-1",
      inputPath: "C:/Media/source.mp4",
      outputPath: "C:/Downloads/clip.mp4",
      mode: "reencode",
      videoCodec: "libx264",
      audioCodec: "aac",
      crf: 23,
      preset: "medium",
      startSeconds: 3.5,
      endSeconds: 9
    });

    expect(invoke).toHaveBeenCalledWith("media_clip_video", {
      request: {
        job_id: "clip-job-1",
        input_path: "C:/Media/source.mp4",
        output_path: "C:/Downloads/clip.mp4",
        mode: "reencode",
        video_codec: "libx264",
        audio_codec: "aac",
        crf: 23,
        preset: "medium",
        start_seconds: 3.5,
        end_seconds: 9
      }
    });
    expect(result.job_id).toBe("clip-job-1");
    expect(result.output_path).toBe("C:/Downloads/clip.mp4");
  });

  it("cancels a running local video clip by job id", async () => {
    invoke.mockResolvedValueOnce({ ok: true });
    const { cancelClipVideo } = await import("../src/lib/api");

    const result = await cancelClipVideo("clip-job-1");

    expect(invoke).toHaveBeenCalledWith("media_cancel_clip", {
      request: { job_id: "clip-job-1" }
    });
    expect(result).toBe(true);
  });

  it("detects shot changes through the media shot command", async () => {
    invoke.mockResolvedValueOnce({
      markers: [
        {
          timestamp_seconds: 1.25,
          score: 0.42
        }
      ]
    });
    const { detectShots } = await import("../src/lib/api");

    const result = await detectShots({
      inputPath: "C:/Media/source.mp4",
      threshold: 0.35
    });

    expect(invoke).toHaveBeenCalledWith("media_detect_shots", {
      request: {
        input_path: "C:/Media/source.mp4",
        threshold: 0.35
      }
    });
    expect(result.markers[0].timestamp_seconds).toBe(1.25);
    expect(result.markers[0].score).toBe(0.42);
  });

  it("saves detected shot markers through the media shot export command", async () => {
    invoke.mockResolvedValueOnce({
      output_path: "C:/Media/source.shots.json",
      marker_count: 1
    });
    const { saveShotMarkers } = await import("../src/lib/api");

    const result = await saveShotMarkers({
      outputPath: "C:/Media/source.shots.json",
      markers: [{ timestamp_seconds: 1.25, score: 0.42 }]
    });

    expect(invoke).toHaveBeenCalledWith("media_save_shot_markers", {
      request: {
        output_path: "C:/Media/source.shots.json",
        markers: [{ timestamp_seconds: 1.25, score: 0.42 }]
      }
    });
    expect(result.marker_count).toBe(1);
  });

  it("generates waveform peaks through the media waveform command", async () => {
    invoke.mockResolvedValueOnce({
      cache_path: "C:/FetchDock/cache/waveform/source.waveform.json",
      sample_rate: 8000,
      channel_count: 1,
      bucket_count: 2,
      duration_seconds: 0.5,
      peaks: [
        {
          index: 0,
          start_seconds: 0,
          end_seconds: 0.25,
          min: -0.5,
          max: 0.5,
          rms: 0.35
        }
      ]
    });
    const { generateWaveformPeaks } = await import("../src/lib/api");

    const result = await generateWaveformPeaks({
      inputPath: "C:/Media/source.mp4",
      bucketCount: 2
    });

    expect(invoke).toHaveBeenCalledWith("media_generate_waveform_peaks", {
      request: {
        input_path: "C:/Media/source.mp4",
        bucket_count: 2
      }
    });
    expect(result.cache_path).toContain("waveform");
    expect(result.peaks[0].max).toBe(0.5);
  });

  it("listens for local video clip progress events", async () => {
    listen.mockResolvedValueOnce(() => undefined);
    const { onClipProgress } = await import("../src/lib/api");
    const handler = vi.fn();

    await onClipProgress(handler);

    expect(listen).toHaveBeenCalledWith("media:clip-progress", expect.any(Function));
  });

  it("passes audio task kind into single download creation", async () => {
    invoke.mockResolvedValueOnce(null);
    const { createDownloadTask } = await import("../src/lib/api");

    await createDownloadTask("https://www.youtube.com/watch?v=abc123", undefined, {
      kind: "audio",
      audioFormat: "mp3"
    });

    expect(invoke).toHaveBeenCalledWith("downloads_create", {
      request: expect.objectContaining({
        source_url: "https://www.youtube.com/watch?v=abc123",
        kind: "audio",
        audio_format: "mp3"
      })
    });
  });

  it("passes selected preview format as task quality", async () => {
    invoke.mockResolvedValueOnce(null);
    const { createDownloadTask } = await import("../src/lib/api");

    await createDownloadTask("https://www.youtube.com/watch?v=abc123", undefined, {
      kind: "video",
      quality: "18"
    });

    expect(invoke).toHaveBeenCalledWith("downloads_create", {
      request: expect.objectContaining({
        source_url: "https://www.youtube.com/watch?v=abc123",
        kind: "video",
        quality: "18"
      })
    });
  });

  it("passes subtitles-only task kind into single download creation", async () => {
    invoke.mockResolvedValueOnce(null);
    const { createDownloadTask } = await import("../src/lib/api");

    await createDownloadTask("https://www.youtube.com/watch?v=abc123", undefined, {
      kind: "subtitles_only"
    });

    expect(invoke).toHaveBeenCalledWith("downloads_create", {
      request: expect.objectContaining({
        source_url: "https://www.youtube.com/watch?v=abc123",
        kind: "subtitles_only"
      })
    });
  });

  it("passes staged authorization payload references into download creation", async () => {
    invoke.mockResolvedValueOnce(null);
    const { createDownloadTask } = await import("../src/lib/api");

    await createDownloadTask("https://media.example.com/video.m3u8", undefined, {
      kind: "video",
      authPayloadRef: "auth-123-media_example_com"
    });

    expect(invoke).toHaveBeenCalledWith("downloads_create", {
      request: expect.objectContaining({
        source_url: "https://media.example.com/video.m3u8",
        kind: "video",
        auth_payload_ref: "auth-123-media_example_com"
      })
    });
  });

  it("wraps extension authorization payload list and delete commands", async () => {
    invoke
      .mockResolvedValueOnce({
        payloads: [
          {
            schema_version: 1,
            payload_ref: "auth-123-example",
            page_url: "https://example.com/watch",
            host: "example.com",
            request_url: "https://cdn.example.com/video.m3u8",
            request_host: "cdn.example.com",
            preview: "Bearer abcd...wxyz",
            source: "popup",
            captured_at: "2026-07-13T00:00:00Z",
            stored_at: "2026-07-13T00:00:01Z"
          }
        ]
      })
      .mockResolvedValueOnce({ deleted: true });
    const { listExtensionAuthorizationPayloads, deleteExtensionAuthorizationPayload } = await import("../src/lib/api");

    const payloads = await listExtensionAuthorizationPayloads();
    const deleted = await deleteExtensionAuthorizationPayload("auth-123-example");

    expect(payloads[0].request_host).toBe("cdn.example.com");
    expect(deleted).toBe(true);
    expect(invoke).toHaveBeenNthCalledWith(1, "extension_list_authorization_payloads");
    expect(invoke).toHaveBeenNthCalledWith(2, "extension_delete_authorization_payload", {
      request: { payload_ref: "auth-123-example" }
    });
  });

  it("wraps plugin event emission through the safe local host log", async () => {
    invoke.mockResolvedValueOnce({
      schema_version: 1,
      id: "media.convert",
      event: "convert.completed",
      status: "recorded_local",
      message: "Plugin event was recorded by the host; dynamic event dispatch is not wired yet.",
      log_path: "C:/FetchDock/plugins/data/media.convert/events.jsonl",
      data_dir: "C:/FetchDock/plugins/data/media.convert"
    });
    const { emitPluginEvent } = await import("../src/lib/api");

    const result = await emitPluginEvent("media.convert", "convert.completed", { taskId: "task-1" });

    expect(result?.status).toBe("recorded_local");
    expect(invoke).toHaveBeenCalledWith("plugins_emit_event", {
      request: {
        id: "media.convert",
        event: "convert.completed",
        payload: { taskId: "task-1" }
      }
    });
  });

  it("wraps plugin event log listing", async () => {
    invoke.mockResolvedValueOnce({
      schema_version: 1,
      id: "media.convert",
      events: [
        {
          schema_version: 1,
          id: "media.convert",
          event: "convert.completed",
          status: "recorded_local",
          message: "Plugin event was recorded by the host; dynamic event dispatch is not wired yet.",
          payload: { taskId: "task-1" },
          created_at: "2026-07-13T00:00:00Z"
        }
      ],
      log_path: "C:/FetchDock/plugins/data/media.convert/events.jsonl"
    });
    const { listPluginEvents } = await import("../src/lib/api");

    const result = await listPluginEvents("media.convert", 10);

    expect(result?.events[0].event).toBe("convert.completed");
    expect(invoke).toHaveBeenCalledWith("plugins_list_events", {
      request: { id: "media.convert", limit: 10 }
    });
  });

  it("wraps plugin command log listing", async () => {
    invoke.mockResolvedValueOnce({
      schema_version: 1,
      id: "media.convert",
      commands: [
        {
          schema_version: 1,
          id: "media.convert",
          command: "convert.start",
          status: "queued_local",
          message: "Plugin command was accepted by the host, but dynamic plugin execution is not wired yet.",
          payload: { taskId: "task-1" },
          created_at: "2026-07-13T00:00:00Z"
        }
      ],
      log_path: "C:/FetchDock/plugins/data/media.convert/command-calls.jsonl"
    });
    const { listPluginCommandLogs } = await import("../src/lib/api");

    const result = await listPluginCommandLogs("media.convert", 10);

    expect(result?.commands[0].command).toBe("convert.start");
    expect(invoke).toHaveBeenCalledWith("plugins_list_command_logs", {
      request: { id: "media.convert", limit: 10 }
    });
  });
});
