'use client';

import {
  CheckCircle2Icon,
  KeyIcon,
  PlusIcon,
  SaveIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserIcon,
  XCircleIcon,
} from 'lucide-react';
import React, { useState } from 'react';

import { Button, Input, Skeleton } from '@/components/atoms/index.atoms';
import {
  ConfirmationDialog,
  EditableInput,
} from '@/components/molecules/index.molecules';
import { useSettings } from '@/contexts/settings.context';

export function Settings() {
  const { deleteApiKey, isSettingsLoaded, saveApiKey, settings, updateApiKey } =
    useSettings();
  const [apiKey, setApiKey] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const geminiKeys = settings.apiKeys.gemini || [];

  const handleSave = async () => {
    if (!apiKey) return;

    setIsLoading(true);
    try {
      const parsedPriority = parseInt(priority) || 1;
      await saveApiKey(
        apiKey,
        'Gemini',
        parsedPriority,
        description || 'Gemini API Key'
      );
      setApiKey('');
      setDescription('');
      setPriority('1');
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to save API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteApiKey(id, 'Gemini');
    } catch (error) {
      console.error('Failed to delete API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='page-container max-w-4xl'>
      <div className='space-y-8'>
        <section className='relative overflow-hidden bg-surface border border-border p-8'>
          <div className='absolute left-0 top-0 bottom-0 w-1 bg-border' />
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-none bg-background flex items-center justify-center border border-border shrink-0'>
                <KeyIcon className='h-5 w-5 text-content-primary' />
              </div>
              <div>
                <h2 className='text-lg font-display font-bold uppercase text-content-primary'>
                  AI Configuration
                </h2>
                <p className='text-xs font-mono text-content-secondary tracking-wide'>
                  Configure your Gemini API keys for generation.
                </p>
              </div>
            </div>
            {geminiKeys.length > 0 && (
              <div className='flex items-center gap-2 px-3 py-1 bg-status-green/10 border border-status-green/20'>
                <CheckCircle2Icon className='h-3 w-3 text-status-green' />
                <span className='text-[10px] font-mono font-bold uppercase tracking-tighter text-status-green'>
                  {geminiKeys.length} Connected
                </span>
              </div>
            )}
          </div>

          <div className='space-y-6'>
            {!isSettingsLoaded ? (
              <div className='space-y-4'>
                <h3 className='text-xs font-display font-bold uppercase tracking-widest text-content-primary'>
                  Active Keys
                </h3>
                <div className='space-y-3'>
                  {[1, 2].map(i => (
                    <div
                      className='flex items-center justify-between p-4 border border-border bg-background'
                      key={i}
                    >
                      <div className='flex items-center gap-4'>
                        <Skeleton className='h-5 w-5 rounded-full' />
                        <div className='space-y-2'>
                          <Skeleton className='h-4 w-32' />
                          <Skeleton className='h-3 w-24' />
                        </div>
                      </div>
                      <Skeleton className='h-8 w-8 rounded-md' />
                    </div>
                  ))}
                </div>
              </div>
            ) : geminiKeys.length > 0 ? (
              <div className='space-y-4'>
                <h3 className='text-xs font-display font-bold uppercase tracking-widest text-content-primary'>
                  Active Keys
                </h3>
                <div className='space-y-3'>
                  {geminiKeys.map((key, index) => (
                    <div
                      className='flex items-center justify-between p-4 border border-border bg-background'
                      key={key._id || index}
                    >
                      <div className='flex items-center gap-4'>
                        {key.status === 'active' ? (
                          <CheckCircle2Icon className='h-5 w-5 text-status-green' />
                        ) : (
                          <XCircleIcon className='h-5 w-5 text-status-red' />
                        )}
                        <div>
                          <div className='flex items-center gap-2 flex-wrap'>
                            <EditableInput
                              className='text-sm font-bold text-content-primary'
                              onSave={val =>
                                updateApiKey(
                                  key._id as string,
                                  { description: val },
                                  'Gemini'
                                )
                              }
                              value={key.meta?.description || 'Gemini API Key'}
                            />
                            <EditableInput
                              onSave={val =>
                                updateApiKey(
                                  key._id as string,
                                  { priority: parseInt(val) || 1 },
                                  'Gemini'
                                )
                              }
                              prefix={
                                <span className='text-[10px] font-mono text-content-secondary px-2 py-0.5 bg-surface border border-border border-r-0 h-[22px] flex items-center'>
                                  Priority:
                                </span>
                              }
                              type='number'
                              value={key.priority || 1}
                            />
                          </div>
                          <p className='text-xs font-mono text-content-tertiary mt-1'>
                            Added{' '}
                            {key.createdAt
                              ? new Date(key.createdAt).toLocaleDateString()
                              : 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <ConfirmationDialog
                        description='Are you sure you want to delete this API key?'
                        onConfirm={() => key._id && handleDelete(key._id)}
                        title='Delete API Key?'
                        trigger={
                          <Button
                            className='text-content-secondary hover:text-status-red hover:bg-status-red/10'
                            disabled={isLoading}
                            size='icon'
                            variant='ghost'
                          >
                            <Trash2Icon className='h-4 w-4' />
                          </Button>
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {isSettingsLoaded && !showAddForm && (
              <Button
                className='w-full border-dashed bg-transparent hover:bg-surface text-content-secondary hover:text-content-primary h-12 rounded-none transition-all mt-4'
                onClick={() => setShowAddForm(true)}
                variant='outline'
              >
                <PlusIcon className='mr-2 h-4 w-4' />
                ADD NEW KEY
              </Button>
            )}

            {showAddForm && (
              <div className='p-6 border border-border bg-background/50 space-y-4 mt-4'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-xs font-display font-bold uppercase tracking-widest text-content-primary'>
                    New Key Details
                  </h3>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    size='sm'
                    variant='ghost'
                  >
                    Cancel
                  </Button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-mono text-content-secondary uppercase'>
                      Key Description
                    </label>
                    <Input
                      className='h-10 rounded-none bg-background border-border'
                      maxLength={50}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDescription(e.target.value)
                      }
                      placeholder='e.g. AI Studio Main (Max 50 chars)'
                      value={description}
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-[10px] font-mono text-content-secondary uppercase'>
                      Priority (1 = Highest)
                    </label>
                    <Input
                      className='h-10 rounded-none bg-background border-border'
                      min={1}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPriority(e.target.value)
                      }
                      type='number'
                      value={priority}
                    />
                  </div>
                </div>

                <div className='space-y-2 pt-2'>
                  <label className='text-[10px] font-mono text-content-secondary uppercase'>
                    API Key Value
                  </label>
                  <div className='relative'>
                    <Input
                      autoComplete='off'
                      className='pl-10 h-10 rounded-none bg-background border-border focus:border-brand transition-all text-content-primary font-mono'
                      disabled={isLoading}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setApiKey(e.target.value)
                      }
                      placeholder='••••••••••••••••'
                      spellCheck={false}
                      type='text'
                      value={apiKey}
                    />
                    <KeyIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-secondary' />
                  </div>
                </div>

                <div className='flex items-center gap-2 mt-2 text-[11px] font-mono text-content-tertiary mb-6'>
                  <ShieldCheckIcon className='h-3 w-3 text-status-green' />
                  <span>Encrypted at rest. Never shared.</span>
                </div>

                <Button
                  className='rounded-none bg-brand text-white hover:bg-brand/90 h-10 px-8 font-display font-bold uppercase tracking-wider text-xs transition-all w-full md:w-auto'
                  disabled={isLoading || !apiKey}
                  onClick={handleSave}
                >
                  {isLoading ? 'Processing...' : 'Save Key'}
                  {!isLoading && <SaveIcon className='ml-2 h-4 w-4' />}
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className='relative overflow-hidden bg-surface border border-border p-8 opacity-50 pointer-events-none'>
          <div className='absolute left-0 top-0 bottom-0 w-1 bg-border' />
          <div className='flex items-center gap-4 mb-4'>
            <div className='h-12 w-12 rounded-none bg-background flex items-center justify-center border border-border shrink-0'>
              <UserIcon className='h-5 w-5 text-content-primary' />
            </div>
            <div>
              <h2 className='text-lg font-display font-bold uppercase text-content-primary'>
                Account Preferences
              </h2>
              <p className='text-xs font-mono text-content-secondary tracking-wide'>
                Language and regional settings.
              </p>
            </div>
          </div>
          <p className='text-xs text-content-tertiary font-display font-bold uppercase tracking-widest mt-6'>
            [ Coming Soon ]
          </p>
        </section>
      </div>
    </div>
  );
}
