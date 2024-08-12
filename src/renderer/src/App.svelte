<script lang="ts">
  import IPCMessage from '../../shared/ipc/enum'
  import Storage from './lib/statefulStorage.svelte'

  import { ipcRenderer } from './lib/ipcRenderer'

  const storage = new Storage()

  let makingPreset = $state(false)
  let newPresetName = $state('')
</script>

<main>
  {#if !storage.curAvatar}
    <h1>Please switch avatars!</h1>
  {:else}
    <input type="text" bind:value={storage.curAvatar.name} />
    <h1>Presets</h1>
    <ul>
      {#each Object.entries(storage.presets) as [presetId, preset]}
        <li>
          <input
            type="text"
            bind:value={preset.name}
            onchange={() => {
              storage.savePresetName()
            }}
          />
          <button onclick={() => storage.loadPreset(presetId)}> Load </button>
          <button onclick={() => storage.savePreset(presetId)}> Save </button>
          <button onclick={() => storage.deletePreset(presetId)}> Delete </button>
        </li>
      {/each}
    </ul>

    {#if makingPreset}
      <input type="text" bind:value={newPresetName} />
      <button
        onclick={() => {
          storage.makePreset(newPresetName)
          makingPreset = false
          newPresetName = ''
        }}
      >
        Create
      </button>
      <button
        onclick={() => {
          makingPreset = false
          newPresetName = ''
        }}
      >
        Cancel
      </button>
    {:else}
      <button onclick={() => (makingPreset = true)}> New </button>
    {/if}
  {/if}

  <button onclick={() => ipcRenderer.invoke(IPCMessage.Util_OpenDataDir)}>Open Data Dir</button>
</main>
