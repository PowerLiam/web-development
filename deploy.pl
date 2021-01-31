#!/usr/bin/perl
use strict;
use warnings;

my $remote_user;
my $remote_url;
my $remote_root_dir;
my $local_root_dir;

my $backup_suffix = "_BACKUP";

sub backup_remote_on_remote {
    print "Backing up remote data on remote server.\n";
    run_remote((
        "rsync", "-r", "--exclude=*${backup_suffix}",
        "${remote_root_dir}/", 
        "${remote_root_dir}/${remote_url}${backup_suffix}"));
}

sub sync_local_to_remote {
    print "Syncing data to remote server.\n";
    system((
        "rsync", "-r", "--exclude=*${backup_suffix}", "--exclude=node_modules",
        "${local_root_dir}/", 
        "${remote_user}\@${remote_url}:${remote_root_dir}"));
}

sub deploy_remote {
    print "Beginning deploy to remote server.\n";
    backup_remote_on_remote();
    sync_local_to_remote();
    print "Finished deploying to remote server.\n";
}

sub run_remote {
    my @remote_cmd = ("ssh", "${remote_user}\@${remote_url}");
    push(@remote_cmd, @_);
    print join(" ", @remote_cmd) . "\n";
    system(@remote_cmd);
}

sub main {
    ($remote_user, $remote_url, $remote_root_dir, $local_root_dir) = @ARGV;

    deploy_remote();
}

main();